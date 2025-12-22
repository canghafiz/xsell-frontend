'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {ByCategoryProductApiResponse, ProductItem} from '@/types/product';
import ProductCard from '@/components/product_card';
import LayoutTemplate from "@/components/layout";
import {subCategoryService} from '@/services/sub_category_service';
import {formatCurrency, getCurrencySymbol} from '@/helpers/currency';

interface ProductCategoryContentProps {
    initialProducts: ByCategoryProductApiResponse;
    categorySlug: string;
    subCategorySlug?: string[];
    imagePrefixUrl: string;
}

export default function ProductCategoryContent({
                                                   initialProducts,
                                                   categorySlug,
                                                   subCategorySlug = [],
                                                   imagePrefixUrl,
                                               }: ProductCategoryContentProps) {
    const [products, setProducts] = useState<ProductItem[]>(initialProducts.data || []);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(21);
    const [hasMore, setHasMore] = useState((initialProducts.data?.length || 0) === 21);

    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(subCategorySlug);
    const [minPrice, setMinPrice] = useState<string>('250');
    const [maxPrice, setMaxPrice] = useState<string>('999999999');
    const [sortBy, setSortBy] = useState<string>('default');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [subCategories, setSubCategories] = useState<{ sub_category_id: number; sub_category_name: string; sub_category_slug: string }[]>([]);

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

    // Sync subcategory to URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('subCategorySlug');
            selectedSubCategories.forEach(slug => {
                url.searchParams.append('subCategorySlug', slug);
            });
            window.history.replaceState({}, '', url.toString());
        }
    }, [selectedSubCategories]);

    // Fetch subcategories
    useEffect(() => {
        const fetchSubCategories = async () => {
            const res = await subCategoryService.getByCategorySlug(categorySlug);
            if (res.success && Array.isArray(res.data)) {
                setSubCategories(res.data);
            }
        };
        fetchSubCategories();
    }, [categorySlug]);

    const LIMIT = 21;

    const applyFilters = useCallback(async (newOffset = 0) => {
        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const queryParams = new URLSearchParams();

            queryParams.append('categorySlug', categorySlug);
            selectedSubCategories.forEach(slug => queryParams.append('subCategorySlug', slug));
            queryParams.append('sortBy', sortBy);
            queryParams.append('minPrice', minPrice || '0');
            queryParams.append('maxPrice', maxPrice || '999999999');
            queryParams.append('limit', LIMIT.toString());
            queryParams.append('offset', newOffset.toString());

            // Add location if available
            const loc = getUserLocationFromCookie();
            if (loc) {
                queryParams.append('latitude', loc.latitude.toString());
                queryParams.append('longitude', loc.longitude.toString());
            }

            const res = await fetch(`${baseUrl}/api/product/category?${queryParams}`);
            const data: ByCategoryProductApiResponse = await res.json();

            if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
                if (newOffset === 0) {
                    setProducts(data.data);
                    setOffset(LIMIT);
                    setHasMore(data.data.length === LIMIT);
                } else {
                    setProducts(prev => {
                        const existingIds = new Set(prev.map(p => p.product_id));
                        const newProducts = (data.data ?? []).filter(p => !existingIds.has(p.product_id));
                        return newProducts.length > 0 ? [...prev, ...newProducts] : prev;
                    });
                    setOffset(prev => prev + LIMIT);
                    setHasMore((data.data ?? []).length === LIMIT);
                }
            } else {
                if (newOffset === 0) {
                    setProducts([]);
                    setHasMore(false);
                } else {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Failed to apply filters:', error);
            if (newOffset === 0) {
                setProducts([]);
                setHasMore(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, [categorySlug, selectedSubCategories, sortBy, minPrice, maxPrice]);

    // 🔁 NEW: Reset to page 1 when sortBy changes
    useEffect(() => {
        applyFilters(0);
    }, [sortBy, applyFilters]);

    // 🔁 NEW: Reset to page 1 when price range changes
    useEffect(() => {
        applyFilters(0);
    }, [minPrice, maxPrice, applyFilters]);

    // 🔁 NEW: Reset to page 1 when subcategories change
    useEffect(() => {
        applyFilters(0);
    }, [selectedSubCategories, applyFilters]);

    // Polling for location changes (does NOT include sortBy/price/subcat in deps)
    useEffect(() => {
        lastLocationRef.current = getUserLocationFromCookie();
        applyFilters(0);

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
                applyFilters(0);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [categorySlug, applyFilters]); // Only deps that should trigger polling

    const loadMore = async () => {
        if (isLoading || !hasMore) return;
        await applyFilters(offset);
    };

    const renderEmptyState = () => {
        if (!initialProducts.success) {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-800">
                        {initialProducts.error || 'Failed to load products'}
                    </p>
                </div>
            );
        }

        if (products.length === 0 && !isLoading) {
            return (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg mb-2">No products found</p>
                    <p className="text-gray-500">Check back later for new items</p>
                </div>
            );
        }

        return null;
    };

    return (
        <LayoutTemplate>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Open filters and sort options"
                    className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-base">Filters & Sort</span>
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <div className="flex gap-6 relative">
                {/* Sidebar */}
                <aside className={`
                    fixed lg:static 
                    top-0 left-0 bottom-0 w-80
                    bg-white z-999 sm:z-50 lg:z-auto
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    overflow-y-auto shadow-2xl lg:shadow-none p-4 lg:p-0
                `}>
                    <div className="lg:hidden flex justify-between items-center mb-4 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-semibold">Filters</h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            aria-label="Close filter panel"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Price Range */}
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-4">
                        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                        <div className="space-y-4">
                            <div className="relative h-2 bg-gray-200 rounded-full">
                                <div
                                    className="absolute h-full bg-red-500 rounded-full"
                                    style={{
                                        left: `${Math.min((parseInt(minPrice || '0') / 1000000) * 100, 100)}%`,
                                        right: `${Math.max(100 - (parseInt(maxPrice || '999999999') / 1000000) * 100, 0)}%`
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1 sr-only">Min Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                            {getCurrencySymbol()}
                                        </span>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            placeholder="250"
                                            className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="pt-5 text-gray-400">—</div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1 sr-only">Max Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                            {getCurrencySymbol()}
                                        </span>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            placeholder="999999999"
                                            className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center py-2 px-4 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">
                                    {formatCurrency(parseInt(minPrice || '0'))} - {formatCurrency(parseInt(maxPrice || '999999999'))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Categories</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            <div className="flex items-center pb-3 border-b border-red-200">
                                <input
                                    id="parent-category"
                                    type="checkbox"
                                    checked={selectedSubCategories.length === 0}
                                    onChange={() => setSelectedSubCategories([])}
                                    className="
        mr-3 h-4 w-4
        accent-red-600
        cursor-pointer
    "
                                />
                                <label
                                    htmlFor="parent-category"
                                    className="text-sm font-medium cursor-pointer hover:text-red-600 transition-colors"
                                >
                                    All {categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </label>
                            </div>
                            {subCategories.map(cat => (
                                <div key={cat.sub_category_slug} className="flex items-center pl-6">
                                    <input
                                        id={`cat-${cat.sub_category_slug}`}
                                        type="checkbox"
                                        checked={selectedSubCategories.includes(cat.sub_category_slug)}
                                        onChange={() => {
                                            const newSelected = selectedSubCategories.includes(cat.sub_category_slug)
                                                ? selectedSubCategories.filter(s => s !== cat.sub_category_slug)
                                                : [...selectedSubCategories, cat.sub_category_slug];
                                            setSelectedSubCategories(newSelected);
                                        }}
                                        className="
            mr-3 h-4 w-4
            accent-red-600
            cursor-pointer
        "
                                    />
                                    <label
                                        htmlFor={`cat-${cat.sub_category_slug}`}
                                        className="text-sm cursor-pointer hover:text-red-600 transition-colors"
                                    >
                                        {cat.sub_category_name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:hidden mt-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-99 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800">Products</h2>
                        <div className="flex items-center gap-3">
                            <label htmlFor="sort-by-select" className="sr-only">Sort products by</label>
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort By:</span>
                            <select
                                id="sort-by-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 min-w-[180px]"
                            >
                                <option value="default">Default</option>
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {renderEmptyState() || (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                        imagePrefixUrl={imagePrefixUrl}
                                        forGrid={true}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={loadMore}
                                        disabled={isLoading}
                                        className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                                    >
                                        {isLoading ? 'Loading...' : 'Load More Products'}
                                    </button>
                                </div>
                            )}

                            {!hasMore && products.length > 0 && (
                                <div className="text-center mt-8 py-4 text-gray-500 text-sm">
                                    You&#39;ve reached the end of the list
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </LayoutTemplate>
    );
}