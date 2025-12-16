"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import pageService from "@/services/page_service";
import LayoutTemplate from "@/components/layout";
import ScrollableSectionClient from "@/components/scrollable_section_client";
import { ProductDetailItem, ProductItem } from "@/types/product";

interface Section {
    section_id: number;
    title: string;
    subtitle: string;
    products?: ProductItem[] | null;
}

interface ProductDetailPageContentProps {
    product: ProductDetailItem;
}

export default function ProductDetailPageContent({ product }: ProductDetailPageContentProps) {
    const [sections, setSections] = useState<Section[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";
    const lastLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);

    const getUserLocationFromCookie = (): { latitude: number; longitude: number } | null => {
        const cookieMatch = document.cookie.match(/user_location=([^;]+)/);
        if (!cookieMatch) return null;
        try {
            const loc = JSON.parse(decodeURIComponent(cookieMatch[1]));
            if (typeof loc.latitude === "number" && typeof loc.longitude === "number") {
                return { latitude: loc.latitude, longitude: loc.longitude };
            }
        } catch (err) {
            console.error("Failed to parse user_location cookie:", err);
        }
        return null;
    };

    const fetchData = useCallback(async (loc?: { latitude: number; longitude: number }) => {
        setLoading(true);

        // --- Page params (for layout sections) ---
        const pageParams: Record<string, string | number> = { limit: 100 };
        if (loc) {
            pageParams.latitude = loc.latitude;
            pageParams.longitude = loc.longitude;
        }
        const pageSlug = "detail";
        pageParams.except_id = product.product_id;

        // --- Related products params (sesuai permintaanmu) ---
        const categoryIds = product.sub_category?.category?.category_id;
        const relatedParams = categoryIds
            ? {
                categoryIds, // tetap sebagai number
                limit: 10,   // ubah jadi 10 seperti contoh URL-mu
                excludeProductId: product.product_id,
                // Tambahkan latitude & longitude jika ada
                ...(loc && {
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                }),
            }
            : null;

        try {
            const [pagesRaw, relatedResponse] = await Promise.all([
                pageService.getPage(pageSlug, pageParams),
                relatedParams
                    ? pageService.getRelatedProducts(relatedParams)
                    : Promise.resolve({ success: false, code: 400, data: [] as ProductItem[] }),
            ]);

            const pageData: Section[] = Array.isArray(pagesRaw?.data?.data) ? pagesRaw.data.data : [];
            setSections(pageData);

            const related: ProductItem[] =
                relatedResponse.success && Array.isArray(relatedResponse.data)
                    ? relatedResponse.data
                    : [];
            setRelatedProducts(related);
        } catch (err) {
            console.error("Failed to fetch page data:", err);
            setSections([]);
            setRelatedProducts([]);
        } finally {
            setLoading(false);
        }
    }, [product]);

    // --- Polling lokasi dari cookie ---
    useEffect(() => {
        const initialLoc = getUserLocationFromCookie();
        lastLocationRef.current = initialLoc;
        fetchData(initialLoc ?? undefined);

        const interval = setInterval(() => {
            const currentLoc = getUserLocationFromCookie();
            const lastLoc = lastLocationRef.current;

            const changed =
                (!lastLoc && currentLoc) ||
                (lastLoc &&
                    currentLoc &&
                    (lastLoc.latitude !== currentLoc.latitude ||
                        lastLoc.longitude !== currentLoc.longitude));

            if (changed) {
                lastLocationRef.current = currentLoc;
                fetchData(currentLoc ?? undefined);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <div className="pb-4 min-h-screen bg-white">
            {relatedProducts.length > 0 && (
                <section className="mb-16 bg-white py-6">
                    <LayoutTemplate>
                        <div className="py-6">
                            <div className="flex justify-between items-start mb-6 px-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Discover similar items you might also like
                                    </p>
                                </div>
                                <button className="text-red-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap hover:underline">
                                    View All →
                                </button>
                            </div>
                            <ScrollableSectionClient products={relatedProducts} imagePrefixUrl={imagePrefixUrl} />
                        </div>
                    </LayoutTemplate>
                </section>
            )}

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : (
                sections.map((section, index) => (
                    <section
                        key={section.section_id}
                        className={`mb-16 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} py-6`}
                    >
                        <LayoutTemplate>
                            <div className="flex justify-between items-start mb-6 px-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{section.subtitle}</p>
                                </div>
                                <button className="text-red-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap hover:underline">
                                    View All →
                                </button>
                            </div>
                            <ScrollableSectionClient products={section.products} imagePrefixUrl={imagePrefixUrl} />
                        </LayoutTemplate>
                    </section>
                ))
            )}
        </div>
    );
}