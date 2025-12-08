'use client';

import { useState } from "react";
import { ProductItem } from "@/types/product";
import { ByCategoryProductApiResponse } from "@/types/product";
import ProductCard from "@/components/product_card";

interface ProductCategoryContentProps {
    initialProducts: ByCategoryProductApiResponse;
    categoryIds: number[];
    imagePrefixUrl: string;
}

export default function ProductCategoryContent({
                                                   initialProducts,
                                                   categoryIds,
                                                   imagePrefixUrl,
                                               }: ProductCategoryContentProps) {
    const [products, setProducts] = useState<ProductItem[]>(initialProducts.data || []);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(21);

    const LIMIT = 21;

    const loadMore = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
            const queryParams = new URLSearchParams();

            categoryIds.forEach(id => {
                queryParams.append('categoryIds', id.toString());
            });

            queryParams.append('sortBy', 'price_desc');
            queryParams.append('minPrice', '0');
            queryParams.append('maxPrice', '9999999999');
            queryParams.append('limit', LIMIT.toString());
            queryParams.append('offset', offset.toString());

            const res = await fetch(`${baseUrl}/api/product/category?${queryParams.toString()}`);
            const data: ByCategoryProductApiResponse = await res.json();

            if (data.success && data.data) {
                if (data.data.length === 0) {
                    setHasMore(false);
                } else {
                    // ✅ Filter out duplicates before adding
                    const existingIds = new Set(products.map(p => p.product_id));
                    const newProducts = data.data.filter(p => !existingIds.has(p.product_id));

                    if (newProducts.length === 0) {
                        setHasMore(false);
                    } else {
                        setProducts(prev => [...prev, ...newProducts]);
                        setOffset(prev => prev + LIMIT);

                        if (data.data.length < LIMIT) {
                            setHasMore(false);
                        }
                    }
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more products:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Error State
    if (!initialProducts.success) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800">
                    {initialProducts.error || "Failed to load products"}
                </p>
            </div>
        );
    }

    // Empty State
    if (products.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg mb-2">No products found</p>
                <p className="text-gray-500">Check back later for new items</p>
            </div>
        );
    }

    return (
        <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                {products.map((product, index) => (
                    <ProductCard
                        key={`${product.product_id}-${index}`}
                        product={product}
                        imagePrefixUrl={imagePrefixUrl}
                    />
                ))}
            </div>

            {/* Load More Button - Red theme */}
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            )}

            {/* End of Results */}
            {!hasMore && products.length > 0 && (
                <div className="text-center mt-8 text-gray-500">
                    <p>You&#39;ve reached the end of the list</p>
                </div>
            )}
        </>
    );
}