import { useEffect, useRef } from 'react';

interface LocationIQ {
    key: string;
    getLayer: (layer: string) => string;
}

interface MapLibreGL {
    Map: new (options: {
        container: HTMLDivElement;
        style: string;
        zoom: number;
        center: [number, number];
    }) => MapInstance;
    Marker: new (element?: HTMLElement) => Marker;
    NavigationControl: new () => unknown;
    FullscreenControl: new () => unknown;
    ScaleControl: new (options?: { maxWidth?: number; unit?: string }) => unknown;
    GeolocateControl: new (options?: { positionOptions?: { enableHighAccuracy?: boolean }; trackUserLocation?: boolean }) => unknown;
}

interface MapInstance {
    addControl: (control: unknown, position: string) => void;
    remove: () => void;
}

interface Marker {
    setLngLat: (coords: [number, number]) => Marker;
    addTo: (map: MapInstance) => Marker;
}

interface LocationIQLayerControl {
    new (options: { key: string; layerStyles: Record<string, string> }): unknown;
}

declare global {
    interface Window {
        locationiq: LocationIQ;
        maplibregl: MapLibreGL;
        locationiqLayerControl: LocationIQLayerControl;
    }
}

interface ShowMapProps {
    longitude: number;
    latitude: number;
}

export default function ShowMap({ longitude, latitude }: ShowMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<MapInstance | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const script = document.createElement('script');
        script.src = 'https://tiles.locationiq.com/v3/libs/maplibre-gl/1.15.2/maplibre-gl.js';
        script.async = true;

        script.onload = () => {
            const styleScript = document.createElement('script');
            styleScript.src = 'https://tiles.locationiq.com/v3/js/liq-styles-ctrl-libre-gl.js?v=0.1.8';
            styleScript.async = true;

            styleScript.onload = () => {
                if (!mapContainer.current) return;

                window.locationiq.key = process.env.NEXT_PUBLIC_MAP_KEY ?? "";

                map.current = new window.maplibregl.Map({
                    container: mapContainer.current,
                    style: window.locationiq.getLayer("Streets"),
                    zoom: 15,
                    center: [longitude, latitude]
                });

                const layerStyles = {
                    "Streets": "streets/vector",
                    "Dark": "dark/vector",
                    "Light": "light/vector"
                };

                map.current.addControl(
                    new window.locationiqLayerControl({
                        key: window.locationiq.key,
                        layerStyles: layerStyles
                    }),
                    'top-left'
                );

                map.current.addControl(new window.maplibregl.NavigationControl(), 'top-right');
                map.current.addControl(new window.maplibregl.FullscreenControl(), 'top-right');
                map.current.addControl(new window.maplibregl.ScaleControl({
                    maxWidth: 80,
                    unit: 'metric'
                }), 'bottom-left');
                map.current.addControl(new window.maplibregl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                }), 'top-right');

                const markerEl = document.createElement('div');
                markerEl.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
                markerEl.style.backgroundSize = 'cover';
                markerEl.style.width = '50px';
                markerEl.style.height = '50px';
                markerEl.style.cursor = 'pointer';

                new window.maplibregl.Marker(markerEl)
                    .setLngLat([longitude, latitude])
                    .addTo(map.current);
            };

            document.head.appendChild(styleScript);
        };

        document.head.appendChild(script);

        const mapCss = document.createElement('link');
        mapCss.rel = 'stylesheet';
        mapCss.href = 'https://tiles.locationiq.com/v3/libs/maplibre-gl/1.15.2/maplibre-gl.css';
        document.head.appendChild(mapCss);

        const styleCss = document.createElement('link');
        styleCss.rel = 'stylesheet';
        styleCss.href = 'https://tiles.locationiq.com/v3/css/liq-styles-ctrl-libre-gl.css?v=0.1.8';
        document.head.appendChild(styleCss);

        return () => {
            if (map.current && map.current.remove) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [longitude, latitude]);

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '400px'
            }}
        />
    );
}