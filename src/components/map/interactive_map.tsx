"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapItem } from "@/types/map";

interface InteractiveMapProps {
    initialLocation?: MapItem;
    onLocationSelect?: (location: MapItem) => void;
    height?: string;
}

export default function InteractiveMap({
                                           initialLocation,
                                           onLocationSelect,
                                           height = "400px"
                                       }: InteractiveMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<unknown>(null);
    const markerRef = useRef<unknown>(null);
    const scriptsLoadedRef = useRef(false);

    const initMap = useCallback(() => {
        if (!mapContainer.current) return;

        const win = window as unknown as {
            maplibregl?: {
                Map: new (opts: {
                    container: HTMLDivElement;
                    style: string;
                    zoom: number;
                    center: [number, number];
                }) => unknown;
                Marker: new (el: HTMLElement) => {
                    setLngLat: (coords: [number, number]) => {
                        addTo: (map: unknown) => unknown;
                    };
                    getLngLat: () => { lat: number; lng: number };
                };
            };
            locationiq?: {
                key: string;
                getLayer: (layer: string) => string;
            };
        };

        if (!win.maplibregl || !win.locationiq) return;

        win.locationiq.key = process.env.NEXT_PUBLIC_MAP_KEY || 'pk.aa7f5d0539c5675b7f3429402939d8fa';

        const center: [number, number] = initialLocation
            ? [initialLocation.longitude, initialLocation.latitude]
            : [105.286585, -5.366689];

        mapRef.current = new win.maplibregl.Map({
            container: mapContainer.current,
            style: win.locationiq.getLayer("Streets"),
            zoom: 12,
            center: center
        });

        // Add initial marker if location provided
        if (initialLocation) {
            const el = document.createElement('div');
            el.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.backgroundSize = 'contain';
            el.style.cursor = 'pointer';

            markerRef.current = new win.maplibregl.Marker(el)
                .setLngLat([initialLocation.longitude, initialLocation.latitude] as [number, number])
                .addTo(mapRef.current);
        }

        // Add click listener
        const map = mapRef.current as {
            on: (
                event: string,
                handler: (e: { lngLat: { wrap: () => { lat: number; lng: number } } }) => void
            ) => void;
        };

        map.on('click', (e: { lngLat: { wrap: () => { lat: number; lng: number } } }) => {
            // Remove old marker
            if (markerRef.current) {
                const marker = markerRef.current as { remove?: () => void };
                if (typeof marker.remove === 'function') {
                    marker.remove();
                }
            }

            // Create new marker
            const el = document.createElement('div');
            el.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.backgroundSize = 'contain';
            el.style.cursor = 'pointer';

            if (win.maplibregl) {
                const wrappedLngLat = e.lngLat.wrap();
                markerRef.current = new win.maplibregl.Marker(el)
                    .setLngLat([wrappedLngLat.lng, wrappedLngLat.lat] as [number, number])
                    .addTo(mapRef.current);

                const lngLat = (markerRef.current as { getLngLat: () => { lat: number; lng: number } }).getLngLat();

                // Call callback with new location
                if (onLocationSelect) {
                    onLocationSelect({
                        latitude: lngLat.lat,
                        longitude: lngLat.lng,
                        address: `Lat: ${lngLat.lat.toFixed(4)}, Lng: ${lngLat.lng.toFixed(4)}`
                    });
                }
            }
        });
    }, [initialLocation, onLocationSelect]);

    useEffect(() => {
        // Load scripts only once
        if (scriptsLoadedRef.current) {
            initMap();
            return;
        }

        // Load MapLibre GL JS
        const maplibreScript = document.createElement("script");
        maplibreScript.src = "https://tiles.locationiq.com/v3/libs/maplibre-gl/1.15.2/maplibre-gl.js";
        maplibreScript.async = true;

        const maplibreCSS = document.createElement("link");
        maplibreCSS.href = "https://tiles.locationiq.com/v3/libs/maplibre-gl/1.15.2/maplibre-gl.css";
        maplibreCSS.rel = "stylesheet";

        // Load LocationIQ Styles
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
                if (typeof map.remove === 'function') {
                    map.remove();
                }
            }
        };
    }, [initMap]);

    // Update marker when initialLocation changes
    useEffect(() => {
        if (!mapRef.current || !initialLocation) return;

        const win = window as unknown as {
            maplibregl?: {
                Marker: new (el: HTMLElement) => {
                    setLngLat: (coords: [number, number]) => {
                        addTo: (map: unknown) => unknown;
                    };
                };
            };
        };

        if (!win.maplibregl) return;

        const { latitude, longitude } = initialLocation;

        // Remove old marker
        if (markerRef.current) {
            const marker = markerRef.current as { remove?: () => void };
            if (typeof marker.remove === 'function') {
                marker.remove();
            }
        }

        // Create new marker
        const el = document.createElement('div');
        el.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
        el.style.width = '50px';
        el.style.height = '50px';
        el.style.backgroundSize = 'contain';
        el.style.cursor = 'pointer';

        markerRef.current = new win.maplibregl.Marker(el)
            .setLngLat([longitude, latitude] as [number, number])
            .addTo(mapRef.current);

        // Center map
        const map = mapRef.current as {
            flyTo?: (opts: { center: [number, number]; zoom: number }) => void;
        };
        if (typeof map.flyTo === 'function') {
            map.flyTo({
                center: [longitude, latitude] as [number, number],
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