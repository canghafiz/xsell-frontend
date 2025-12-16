'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryService } from '@/services/category_service';
import type { CategoryWithSubCategory, WithSubCategoryItem } from '@/types/category';
import { formatCurrency, getCurrencySymbol } from "@/helpers/currency";
import LayoutTemplate from "@/components/layout";

/**
 * Product filtering component with dynamic category/subcategory selection
 * and automatic location detection from cookies (location not exposed in URL)
 */
export default function ProductByPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- Initialize state from URL parameters ---
    const initialCategorySlug = searchParams.get('categorySlug') || 'all';
    const initialSubCategorySlugs = searchParams.getAll('subCategorySlug');
    const isSubAll = initialSubCategorySlugs.length === 1 && initialSubCategorySlugs[0] === 'all';
    const initialSortBy = searchParams.get('sortBy') || 'latest';
    const initialMinPrice = searchParams.get('minPrice') || '0';
    const initialMaxPrice = searchParams.get('maxPrice') || '9999999999';
    // ❌ HAPUS INI: const initialLimit = searchParams.get('limit') || '21';

    // --- Component state ---
    const [categories, setCategories] = useState<CategoryWithSubCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
        isSubAll ? ['all'] : initialSubCategorySlugs
    );
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [minPrice, setMinPrice] = useState<string>(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice);
    const [sortBy, setSortBy] = useState<string>(initialSortBy);
    // ❌ HAPUS: const [limit] = useState<string>(initialLimit);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Ref to track location changes ---
    const lastLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);

    const getUserLocationFromCookie = useCallback((): { latitude: number; longitude: number } | null => {
        const cookieMatch = document.cookie.match(/user_location=([^;]+)/);
        if (!cookieMatch) return null;
        try {
            const loc = JSON.parse(decodeURIComponent(cookieMatch[1]));
            if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
                return { latitude: loc.latitude, longitude: loc.longitude };
            }
        } catch (err) {
            console.error("Failed to parse user_location cookie:", err);
        }
        return null;
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await categoryService.getCategoriesWithSub();
            if (data) {
                setCategories(data);
                if (initialCategorySlug !== 'all') {
                    setExpandedCategories(new Set([initialCategorySlug]));
                }
            }
        };
        loadCategories();
    }, [initialCategorySlug]);

    useEffect(() => {
        const updateLocation = () => {
            const currentLoc = getUserLocationFromCookie();
            const lastLoc = lastLocationRef.current;
            const hasLocationChanged =
                (!lastLoc && currentLoc) ||
                (lastLoc && currentLoc &&
                    (lastLoc.latitude !== currentLoc.latitude ||
                        lastLoc.longitude !== currentLoc.longitude));

            if (hasLocationChanged) {
                lastLocationRef.current = currentLoc;
                setUserLocation(currentLoc);
            }
        };

        updateLocation();
        const interval = setInterval(updateLocation, 1000);
        return () => clearInterval(interval);
    }, [getUserLocationFromCookie]);

    // --- URL synchronization effect (NO limit in URL) ---
    useEffect(() => {
        const params = new URLSearchParams();

        params.set('categorySlug', selectedCategory);

        if (selectedSubCategories.includes('all')) {
            params.set('subCategorySlug', 'all');
        } else {
            selectedSubCategories.forEach(slug => params.append('subCategorySlug', slug));
        }

        if (sortBy !== 'latest') params.set('sortBy', sortBy);
        if (minPrice !== '0') params.set('minPrice', minPrice);
        if (maxPrice !== '9999999999') params.set('maxPrice', maxPrice);
        // ✅ TIDAK ADA params.set('limit', ...) di sini

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [
        selectedCategory,
        selectedSubCategories,
        minPrice,
        maxPrice,
        sortBy,
        // ❌ HAPUS: limit,
        router
    ]);

    // --- UI Event Handlers ---
    const handleCategoryClick = (slug: string) => {
        setSelectedCategory(slug);
        setSelectedSubCategories(['all']);
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(slug)) {
                newSet.delete(slug);
            } else {
                newSet.add(slug);
            }
            return newSet;
        });
        setIsSidebarOpen(false);
    };

    const toggleSubCategory = (slug: string) => {
        setSelectedSubCategories(prev => {
            if (prev.includes('all')) return [slug];
            if (prev.includes(slug)) {
                const updated = prev.filter(s => s !== slug);
                return updated.length === 0 ? ['all'] : updated;
            }
            return [...prev, slug];
        });
        setIsSidebarOpen(false);
    };

    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedSubCategories(['all']);
        setMinPrice('0');
        setMaxPrice('9999999999');
        setSortBy('latest');
        setIsSidebarOpen(false);
    };

    return (
        <LayoutTemplate>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="text-base">Filters</span>
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

                {/* Filter Sidebar - Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`fixed lg:static inset-y-0 left-0 w-80 bg-white z-50 lg:z-auto transform transition-transform duration-300 ease-in-out p-4 lg:p-0 overflow-y-auto shadow-xl lg:shadow-none ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-semibold">Filters</h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            aria-label="Close filters"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Price Range */}
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-6">
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
                    <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3">Categories</h3>
                        <div className="space-y-1">
                            <div
                                key="category-all"
                                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                    selectedCategory === 'all'
                                        ? 'bg-red-100 text-red-700'
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleCategoryClick('all')}
                            >
                                <span>All Categories</span>
                            </div>

                            {categories.map(category => (
                                <div key={category.category_slug}>
                                    <div
                                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                                            selectedCategory === category.category_slug
                                                ? 'bg-red-100 text-red-700'
                                                : 'hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleCategoryClick(category.category_slug)}
                                    >
                                        <span>{category.category_name}</span>
                                        {category.sub_categories && category.sub_categories.length > 0 && (
                                            <svg
                                                className={`w-4 h-4 transition-transform ${
                                                    expandedCategories.has(category.category_slug) ? 'rotate-90' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 5l7 7-7 7"/>
                                            </svg>
                                        )}
                                    </div>

                                    {expandedCategories.has(category.category_slug) &&
                                        selectedCategory === category.category_slug &&
                                        category.sub_categories && (
                                            <div className="ml-4 mt-1 space-y-1 border-l-2 pl-2">
                                                <div
                                                    className={`flex items-center p-1.5 rounded cursor-pointer transition-colors ${
                                                        selectedSubCategories.includes('all')
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedSubCategories(['all']);
                                                        setIsSidebarOpen(false);
                                                    }}
                                                >
                                                    <span>All {category.category_name}</span>
                                                </div>

                                                {category.sub_categories.map((sub: WithSubCategoryItem) => (
                                                    <div
                                                        key={sub.sub_category_id}
                                                        className={`flex items-center p-1.5 rounded cursor-pointer transition-colors ${
                                                            selectedSubCategories.includes(sub.sub_category_slug)
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'hover:bg-gray-100'
                                                        }`}
                                                        onClick={() => toggleSubCategory(sub.sub_category_slug)}
                                                    >
                                                        <span>{sub.sub_category_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons - Mobile Only */}
                    <div className="lg:hidden mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={resetFilters}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
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

                    <div className="bg-gray-50 rounded-lg p-6 min-h-96">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Products will appear here</h2>
                        <p className="text-gray-600">
                            {userLocation
                                ? `Location detected: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
                                : 'Location not available'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Note: Location is used internally and will not appear in the URL.
                        </p>
                    </div>
                </main>
            </div>
        </LayoutTemplate>
    );
}