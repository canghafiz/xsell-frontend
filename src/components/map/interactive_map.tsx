"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapItem } from "@/types/map";

interface InteractiveMapProps {
    initialLocation?: MapItem;
    onLocationSelect?: (location: MapItem) => void;
    height?: string;
}

// Type definitions
interface LngLat {
    lat: number;
    lng: number;
    wrap: () => LngLat;
}

interface MapClickEvent {
    lngLat: LngLat;
}

interface MapLibreMarker {
    setLngLat: (coords: [number, number]) => MapLibreMarker;
    addTo: (map: unknown) => MapLibreMarker;
    getLngLat: () => LngLat;
    remove: () => void;
}

interface MapLibreGL {
    Map: new (opts: {
        container: HTMLDivElement;
        style: string;
        zoom: number;
        center: [number, number];
    }) => unknown;
    Marker: new (el: HTMLElement) => MapLibreMarker;
    NavigationControl: new () => unknown;
    FullscreenControl: new () => unknown;
    ScaleControl: new (opts: { maxWidth: number; unit: string }) => unknown;
    GeolocateControl: new (opts: {
        positionOptions: { enableHighAccuracy: boolean };
        trackUserLocation: boolean;
    }) => unknown;
}

interface LocationIQ {
    key: string;
    getLayer: (layer: string) => string;
}

export default function InteractiveMap({
                                           initialLocation,
                                           onLocationSelect,
                                           height = "400px"
                                       }: InteractiveMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<unknown>(null);
    const markerRef = useRef<MapLibreMarker | null>(null);
    const scriptsLoadedRef = useRef(false);

    const initMap = useCallback(() => {
        if (!mapContainer.current) return;

        const win = window as unknown as { maplibregl?: MapLibreGL; locationiq?: LocationIQ };

        if (!win.maplibregl || !win.locationiq) return;

        const maplibregl = win.maplibregl;
        const locationiq = win.locationiq;

        locationiq.key = process.env.NEXT_PUBLIC_MAP_KEY || 'pk.aa7f5d0539c5675b7f3429402939d8fa';

        const center: [number, number] = initialLocation
            ? [initialLocation.longitude, initialLocation.latitude]
            : [105.286585, -5.366689];

        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            style: locationiq.getLayer("Streets"),
            zoom: initialLocation ? 14 : 20,
            center: center
        });

        mapRef.current = mapInstance;

        // === ADD CONTROLS ===
        // Navigation (zoom & rotate)
        const nav = new maplibregl.NavigationControl();
        (mapInstance as { addControl: (control: unknown, position?: string) => void }).addControl(nav, 'top-right');

        // Fullscreen
        (mapInstance as { addControl: (control: unknown) => void }).addControl(new maplibregl.FullscreenControl());

        // Scale
        (mapInstance as { addControl: (control: unknown) => void }).addControl(
            new maplibregl.ScaleControl({
                maxWidth: 80,
                unit: 'metric'
            })
        );

        // Geolocation (only works on HTTPS)
        (mapInstance as { addControl: (control: unknown) => void }).addControl(
            new maplibregl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            })
        );

        // Add initial marker if location provided
        if (initialLocation) {
            const el = document.createElement('div');
            el.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.backgroundSize = 'contain';
            el.style.cursor = 'pointer';

            markerRef.current = new maplibregl.Marker(el)
                .setLngLat([initialLocation.longitude, initialLocation.latitude])
                .addTo(mapInstance);
        }

        // Add click listener
        (mapInstance as { on: (event: string, handler: (e: MapClickEvent) => void) => void }).on('click', (e: MapClickEvent) => {
            // Remove old marker
            if (markerRef.current) {
                markerRef.current.remove();
            }

            // Create new marker
            const el = document.createElement('div');
            el.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.backgroundSize = 'contain';
            el.style.cursor = 'pointer';

            const wrappedLngLat = e.lngLat.wrap();
            markerRef.current = new maplibregl.Marker(el)
                .setLngLat([wrappedLngLat.lng, wrappedLngLat.lat])
                .addTo(mapInstance);

            const lngLat = markerRef.current.getLngLat();

            if (onLocationSelect) {
                onLocationSelect({
                    latitude: lngLat.lat,
                    longitude: lngLat.lng,
                    address: `Lat: ${lngLat.lat.toFixed(4)}, Lng: ${lngLat.lng.toFixed(4)}`
                });
            }
        });
    }, [initialLocation, onLocationSelect]);

    useEffect(() => {
        if (scriptsLoadedRef.current) {
            initMap();
            return;
        }

        // Load MapLibre GL JS & CSS
        const maplibreScript = document.createElement("script");
        maplibreScript.src = "https://tiles.locationiq.com/v3/libs/maplibre-gl/1.15.2/maplibre-gl.js";
        maplibreScript.async = true;

        const maplibreCSS = document.createElement("link");
        maplibreCSS.href = "https://tiles.locationiq.com/v3/libs/maplibre-gl/1.15.2/maplibre-gl.css";
        maplibreCSS.rel = "stylesheet";

        // Load LocationIQ styles
        const liqScript = document.createElement("script");
        liqScript.src = "https://tiles.locationiq.com/v3/js/liq-styles-ctrl-libre-gl.js?v=0.1.8";
        liqScript.async = true;

        const liqCSS = document.createElement("link");
        liqCSS.href = "https://tiles.locationiq.com/v3/css/liq-styles-ctrl-libre-gl.css?v=0.1.8";
        liqCSS.rel = "stylesheet";

        document.head.appendChild(maplibreCSS);
        document.head.appendChild(liqCSS);
        document.body.appendChild(maplibreScript);
        document.body.appendChild(liqScript);

        maplibreScript.onload = () => {
            liqScript.onload = () => {
                scriptsLoadedRef.current = true;
                initMap();
            };
        };

        return () => {
            if (mapRef.current) {
                const map = mapRef.current as { remove?: () => void };
                if (map.remove) {
                    map.remove();
                }
            }
        };
    }, [initMap]);

    // Update marker & center when initialLocation changes
    useEffect(() => {
        if (!mapRef.current || !initialLocation) return;

        const win = window as unknown as { maplibregl?: MapLibreGL };

        if (!win.maplibregl) return;

        const maplibregl = win.maplibregl;
        const { latitude, longitude } = initialLocation;

        if (markerRef.current) {
            markerRef.current.remove();
        }

        const el = document.createElement('div');
        el.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
        el.style.width = '50px';
        el.style.height = '50px';
        el.style.backgroundSize = 'contain';
        el.style.cursor = 'pointer';

        markerRef.current = new maplibregl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);

        const map = mapRef.current as { flyTo?: (opts: { center: [number, number]; zoom: number }) => void };
        if (map.flyTo) {
            map.flyTo({
                center: [longitude, latitude],
                zoom: 14
            });
        }
    }, [initialLocation]);

    return (
        <div
            ref={mapContainer}
            style={{ width: '100%', height }}
            className="rounded-lg"
        />
    );
}