"use client";

import { useEffect, useState, useRef } from "react";
import pageService from "@/services/page_service";
import LayoutTemplate from "@/components/layout";
import HeroSection from "@/components/hero_section";
import ScrollableSectionClient from "@/components/scrollable_section_client";
import { ProductItem } from "@/types/product";

interface Section {
    section_id: number;
    title: string;
    subtitle: string;
    products?: ProductItem[] | null;
}

export default function PageHome() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";

    // Keep track of last known location
    const lastLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);

    // Function to read user_location cookie
    const getUserLocationFromCookie = (): { latitude: number; longitude: number } | null => {
        const cookieMatch = document.cookie.match(/user_location=([^;]+)/);
        if (!cookieMatch) return null;
        try {
            const loc = JSON.parse(decodeURIComponent(cookieMatch[1]));
            if (loc.latitude && loc.longitude) {
                return { latitude: loc.latitude, longitude: loc.longitude };
            }
        } catch (err) {
            console.error("Failed to parse user_location cookie:", err);
        }
        return null;
    };

    // Fetch page data from API
    const fetchPage = async (loc?: { latitude: number; longitude: number }) => {
        setLoading(true);

        const params: Record<string, string | number> = { limit: 100 };
        if (loc) {
            params.latitude = loc.latitude;
            params.longitude = loc.longitude;
        }

        try {
            const pages = await pageService.getPage("home", params);
            setSections(pages.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch page data:", err);
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        const initialLoc = getUserLocationFromCookie();
        lastLocationRef.current = initialLoc;
        fetchPage(initialLoc ?? undefined);

        // Polling every second to detect cookie changes
        const interval = setInterval(() => {
            const currentLoc = getUserLocationFromCookie();

            // Only fetch if location changed
            const lastLoc = lastLocationRef.current;
            const changed =
                (!lastLoc && currentLoc) ||
                (lastLoc &&
                    currentLoc &&
                    (lastLoc.latitude !== currentLoc.latitude ||
                        lastLoc.longitude !== currentLoc.longitude));

            if (changed) {
                lastLocationRef.current = currentLoc;
                fetchPage(currentLoc ?? undefined);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <HeroSection />

            {/* Page Sections */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : (
                <div className="py-10">
                    {sections.map((section, index) => (
                        <section
                            key={section.section_id}
                            className={`mb-16 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"} py-6`}
                        >
                            <LayoutTemplate>
                                {/* Section Header */}
                                <div className="flex justify-between items-start mb-6 px-2">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                        <p className="text-sm text-gray-600 mt-1">{section.subtitle}</p>
                                    </div>
                                    <button className="text-red-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap hover:underline">
                                        View All →
                                    </button>
                                </div>

                                {/* Scrollable Products */}
                                <ScrollableSectionClient
                                    products={section.products}
                                    imagePrefixUrl={imagePrefixUrl}
                                />
                            </LayoutTemplate>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
