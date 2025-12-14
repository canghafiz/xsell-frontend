"use client";

import { MapPin, Search, X } from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import mapService from "@/services/map_service";
import { MapItem } from "@/types/map";

const LOCATION_COOKIE_KEY = "user_location";

// Updated Bandar Lampung coordinates
const DEFAULT_LOCATION: MapItem = {
    latitude: -5.4460713,
    longitude: 105.2643742,
    address: "Bandar Lampung, Lampung",
};

interface DropdownMapLocationProps {
    onLocationChange?: (location: MapItem) => void;
}

export default function DropdownMapLocation({
                                                onLocationChange,
                                            }: DropdownMapLocationProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<MapItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [geolocationStatus, setGeolocationStatus] = useState<"idle" | "requesting" | "success" | "error">("idle");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getCurrentLocationFromCookie = (): MapItem => {
        if (typeof window === "undefined") return DEFAULT_LOCATION;
        const cookieValue = Cookies.get(LOCATION_COOKIE_KEY);
        if (cookieValue) {
            try {
                const parsed = JSON.parse(cookieValue);
                if (
                    typeof parsed.latitude === "number" &&
                    typeof parsed.longitude === "number" &&
                    typeof parsed.address === "string"
                ) {
                    return parsed;
                }
            } catch (e) {
                console.warn("Invalid location cookie, using default");
            }
        }
        return DEFAULT_LOCATION;
    };

    const [selectedLocation, setSelectedLocation] = useState<MapItem>(() =>
        getCurrentLocationFromCookie()
    );

    const saveLocationToCookie = (location: MapItem) => {
        Cookies.set(LOCATION_COOKIE_KEY, JSON.stringify(location), {
            expires: 365,
            path: "/",
            sameSite: "lax",
        });
    };

    const setLocation = (location: MapItem) => {
        setSelectedLocation(location);
        saveLocationToCookie(location);
        if (onLocationChange) onLocationChange(location);
        setIsDropdownOpen(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setSearchQuery("");
                setGeolocationStatus("idle");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const handleSelectLocation = (location: MapItem) => {
        // Immediately update UI and cookie
        setSelectedLocation(location);
        saveLocationToCookie(location);
        if (onLocationChange) onLocationChange(location);
        setIsDropdownOpen(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    // Use Bandar Lampung (default)
    const handleUseBandarLampung = () => {
        setLocation(DEFAULT_LOCATION);
    };

    // Get browser geolocation with typed service
    const handleGetCurrentLocation = () => {
        setGeolocationStatus("requesting");

        if (!navigator.geolocation) {
            setGeolocationStatus("error");
            setLocation(DEFAULT_LOCATION);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                mapService.toAddress(latitude, longitude)
                    .then(response => {
                        if (response.success && response.data) {
                            const location: MapItem = {
                                latitude,
                                longitude,
                                address: response.data.address || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
                            };
                            setLocation(location);
                        } else {
                            setLocation({
                                latitude,
                                longitude,
                                address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
                            });
                        }
                        setGeolocationStatus("success");
                    })
                    .catch(() => {
                        setLocation({
                            latitude,
                            longitude,
                            address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
                        });
                        setGeolocationStatus("success");
                    });
            },
            (error) => {
                console.warn("Geolocation error:", error);
                setGeolocationStatus("error");
                setLocation(DEFAULT_LOCATION);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    return (
        <div className="relative w-full md:w-[130px]" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors justify-between text-sm"
                aria-label="Select location"
            >
                <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate w-full md:w-[130px]">
            {selectedLocation.address}
          </span>
                </div>
                <span className="text-gray-400 flex-shrink-0">
          {isDropdownOpen ? <X className="h-4 w-4" /> : "▼"}
        </span>
            </button>

            {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full md:w-[350px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[400px] overflow-hidden">
                    {/* 1. Bandar Lampung (Default) */}
                    <div className="p-3 border-b border-gray-100">
                        <button
                            type="button"
                            onClick={handleUseBandarLampung}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left"
                        >
                            <div className="p-1.5 bg-gray-100 rounded-md">
                                <MapPin className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Bandar Lampung</div>
                                <div className="text-sm text-gray-500">Default location</div>
                            </div>
                        </button>
                    </div>

                    {/* 2. Current Location (Geolocation) */}
                    <div className="p-3 border-b border-gray-100">
                        <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            disabled={geolocationStatus === "requesting"}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left disabled:opacity-70"
                        >
                            <div className="p-1.5 bg-red-100 rounded-md">
                                {geolocationStatus === "requesting" ? (
                                    <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <MapPin className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Use Current Location</div>
                                <div className="text-sm text-gray-500">
                                    {geolocationStatus === "requesting"
                                        ? "Getting location..."
                                        : "Browser will ask for permission"}
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="px-3 py-1.5 text-xs text-gray-500">Or search manually</div>

                    {/* 3. Search */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for locations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                autoFocus
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-[200px] overflow-y-auto">
                        {searchQuery.trim().length > 0 && !isSearching && searchResults.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm">No locations found</div>
                        )}

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
                </div>
            )}
        </div>
    );
}