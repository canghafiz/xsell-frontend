"use client";

import InteractiveMap from "@/components/map/interactive_map";
import { usePostStore } from "@/stores/post_store";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import mapService from "@/services/map_service";
import { MapItem } from "@/types/map";

export default function PostLocation() {
    const { location, setLocation } = usePostStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<MapItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isConverting, setIsConverting] = useState(false);

    // Handle search input (debounced)
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(async () => {
            try {
                const response = await mapService.autoComplete(searchQuery.trim(), 5);
                setSearchResults(response.success && response.data ? response.data : []);
            } catch (err) {
                console.error("Location search failed", err);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectLocation = (loc: MapItem) => {
        setLocation(loc);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleMapClick = async (loc: MapItem) => {
        setIsConverting(true);

        try {
            const response = await mapService.toAddress(loc.latitude, loc.longitude);

            if (response.success && response.data) {
                setLocation({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    address: response.data.address || `Lat: ${loc.latitude.toFixed(4)}, Lng: ${loc.longitude.toFixed(4)}`
                });
            } else {
                setLocation({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    address: `Lat: ${loc.latitude.toFixed(4)}, Lng: ${loc.longitude.toFixed(4)}`
                });
            }
        } catch (error) {
            console.error("Failed to convert coordinates to address", error);
            setLocation({
                latitude: loc.latitude,
                longitude: loc.longitude,
                address: `Lat: ${loc.latitude.toFixed(4)}, Lng: ${loc.longitude.toFixed(4)}`
            });
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for locations..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-[200px] overflow-y-auto">
                        {searchResults.map((loc, idx) => (
                            <button
                                key={`${loc.latitude}-${loc.longitude}-${idx}`}
                                type="button"
                                onClick={() => handleSelectLocation(loc)}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">{loc.address}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {searchQuery.trim().length > 0 && !isSearching && searchResults.length === 0 && (
                    <div className="mt-2 p-4 text-center text-gray-500 text-sm border border-gray-200 rounded-lg">
                        No locations found
                    </div>
                )}
            </div>

            {/* Interactive Map - Click to select location */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Click on map to select location
                </label>
                {isConverting && (
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        Converting coordinates to address...
                    </div>
                )}
                <div className="rounded-lg overflow-hidden border border-gray-200">
                    <InteractiveMap
                        initialLocation={location || undefined}
                        onLocationSelect={handleMapClick}
                        height="400px"
                    />
                </div>
            </div>

            {/* Selected Location Info */}
            {location && (
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">Selected Location:</div>
                    <div className="text-sm text-gray-600 mt-1">{location.address}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                    </div>
                </div>
            )}
        </div>
    );
}