'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryService } from '@/services/category_service';
import type { CategoryWithSubCategory, WithSubCategoryItem } from '@/types/category';
import type { ProductItem } from '@/types/product';
import { formatCurrency, getCurrencySymbol } from "@/helpers/currency";
import LayoutTemplate from "@/components/layout";
import ProductCard from "@/components/product_card";
import { productService } from '@/services/product_service';

interface SearchResultsProps {
    imagePrefixUrl: string;
}

export default function SearchResults({ imagePrefixUrl }: SearchResultsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('title') || '';
    const initialCategorySlug = searchParams.get('categorySlug') || 'all';
    const initialSubCategorySlug = searchParams.get('subCategorySlug') || 'all';
    const initialSortBy = searchParams.get('sortBy') || 'latest';
    const initialMinPrice = searchParams.get('minPrice') || '0';
    const initialMaxPrice = searchParams.get('maxPrice') || '9999999999';

    const [query] = useState<string>(initialQuery);
    const [categories, setCategories] = useState<CategoryWithSubCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSubCategorySlug);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentLimit, setCurrentLimit] = useState(21);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState<string>(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice);
    const [sortBy, setSortBy] = useState<string>(initialSortBy);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const LIMIT_INCREMENT = 21;

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

    // Load categories
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

    // Sync to URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('title', query);
        params.set('categorySlug', selectedCategory);
        params.set('subCategorySlug', selectedSubCategory);
        if (sortBy !== 'latest') params.set('sortBy', sortBy);
        if (minPrice !== '0') params.set('minPrice', minPrice);
        if (maxPrice !== '9999999999') params.set('maxPrice', maxPrice);
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [query, selectedCategory, selectedSubCategory, sortBy, minPrice, maxPrice, router]);

    const fetchProducts = useCallback(async (limit: number) => {
        if (!query.trim()) {
            setProducts([]);
            setHasMore(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const loc = getUserLocationFromCookie();
            const latitude = loc ? loc.latitude.toString() : "-5.4460713";
            const longitude = loc ? loc.longitude.toString() : "105.2643742";

            console.log('📤 Fetching products with limit:', limit);

            const response = await productService.search(query.trim(), {
                categorySlug: selectedCategory,
                subCategorySlug: selectedSubCategory,
                sortBy,
                minPrice,
                maxPrice,
                limit,
                latitude,
                longitude,
            });

            console.log('📥 Response received:', response.data?.length, 'products');

            if (response.success && response.data) {
                const newProducts = response.data;
                const newProductsCount = newProducts.length;

                setProducts(newProducts);
                setCurrentLimit(limit);

                // Hide "Load More" if returned products < requested limit
                setHasMore(newProductsCount >= limit);
                console.log('HasMore:', newProductsCount >= limit, '(returned:', newProductsCount, 'requested:', limit, ')');
            } else {
                setProducts([]);
                setCurrentLimit(LIMIT_INCREMENT);
                setHasMore(false);
                if (!response.success) {
                    setError('Failed to load products.');
                }
            }
        } catch (err) {
            console.error('Search failed:', err);
            setError('Failed to load products.');
            setProducts([]);
            setCurrentLimit(LIMIT_INCREMENT);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [query, selectedCategory, selectedSubCategory, sortBy, minPrice, maxPrice, getUserLocationFromCookie]);

    // Reset to initial limit when filters change
    useEffect(() => {
        fetchProducts(LIMIT_INCREMENT);
    }, [fetchProducts]);

    // Location polling
    useEffect(() => {
        lastLocationRef.current = getUserLocationFromCookie();
        const interval = setInterval(() => {
            const currentLoc = getUserLocationFromCookie();
            const lastLoc = lastLocationRef.current;
            const changed = (!lastLoc && currentLoc) ||
                (lastLoc && currentLoc && (lastLoc.latitude !== currentLoc.latitude || lastLoc.longitude !== currentLoc.longitude));
            if (changed) {
                lastLocationRef.current = currentLoc;
                fetchProducts(LIMIT_INCREMENT);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [getUserLocationFromCookie, fetchProducts]);

    const loadMoreProducts = () => {
        if (isLoading || !hasMore) return;
        const newLimit = currentLimit + LIMIT_INCREMENT;
        fetchProducts(newLimit);
    };

    // Category handlers
    const handleCategoryClick = (slug: string) => {
        setSelectedCategory(slug);
        setSelectedSubCategory('all');
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

    const handleSubCategoryClick = (slug: string) => {
        setSelectedSubCategory(slug);
        setIsSidebarOpen(false);
    };

    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedSubCategory('all');
        setMinPrice('0');
        setMaxPrice('9999999999');
        setSortBy('latest');
        setIsSidebarOpen(false);
    };

    const renderEmptyState = () => {
        if (error) {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-800">{error}</p>
                </div>
            );
        }
        if (products.length === 0 && !isLoading && query) {
            return (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg mb-2">No products found</p>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
            );
        }
        return null;
    };

    return (
        <LayoutTemplate>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Mobile Filter Button */}
                <div className="lg:hidden">
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
                    className={`fixed lg:static inset-y-0 left-0 w-80 bg-white z-999 sm:z-50 lg:z-auto transform transition-transform duration-300 ease-in-out p-4 lg:p-0 overflow-y-auto shadow-xl lg:shadow-none ${
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
                                            placeholder="0"
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
                                            placeholder="9999999999"
                                            className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center py-2 px-4 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">
                                    {formatCurrency(parseInt(minPrice || '0'))} - {formatCurrency(parseInt(maxPrice || '9999999999'))}
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
                                                className={`w-4 h-4 transition-transform text-red-500 ${
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
                                                <label
                                                    htmlFor={`subcat-all-${category.category_slug}`}
                                                    className={`flex items-center p-1.5 rounded cursor-pointer transition-colors ${
                                                        selectedSubCategory === 'all'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <input
                                                        id={`subcat-all-${category.category_slug}`}
                                                        type="radio"
                                                        name="subcategory-radio"
                                                        value="all"
                                                        checked={selectedSubCategory === 'all'}
                                                        onChange={(e) => handleSubCategoryClick(e.target.value)}
                                                        className="mr-2 h-4 w-4 accent-red-600 border-gray-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                                                    />
                                                    <span>All {category.category_name}</span>
                                                </label>

                                                {category.sub_categories.map((sub: WithSubCategoryItem) => (
                                                    <label
                                                        key={sub.sub_category_id}
                                                        htmlFor={`subcat-${sub.sub_category_slug}`}
                                                        className={`flex items-center p-1.5 rounded cursor-pointer transition-colors ${
                                                            selectedSubCategory === sub.sub_category_slug
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        <input
                                                            id={`subcat-${sub.sub_category_slug}`}
                                                            type="radio"
                                                            name="subcategory-radio"
                                                            value={sub.sub_category_slug}
                                                            checked={selectedSubCategory === sub.sub_category_slug}
                                                            onChange={(e) => handleSubCategoryClick(e.target.value)}
                                                            className="mr-2 h-4 w-4 accent-red-600 border-gray-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                                                        />
                                                        <span>{sub.sub_category_name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:hidden mt-4 mb-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Search Results for &#34;{query}&#34;
                            {selectedSubCategory && selectedSubCategory !== 'all' && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({categories
                                    .find(c => c.category_slug === selectedCategory)
                                    ?.sub_categories?.find(s => s.sub_category_slug === selectedSubCategory)
                                    ?.sub_category_name})
                                </span>
                            )}
                        </h2>
                        <div className="flex items-center gap-3">
                            <label htmlFor="sort-by-select" className="sr-only">Sort by</label>
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort By:</span>
                            <select
                                id="sort-by-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 min-w-[180px]"
                            >
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {isLoading && products.length === 0 ? (
                        <div className="flex justify-center items-center min-h-96">
                            <div className="text-gray-600">Loading products...</div>
                        </div>
                    ) : (
                        <>
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
                                                onClick={loadMoreProducts}
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
                        </>
                    )}
                </main>
            </div>
        </LayoutTemplate>
    );
}