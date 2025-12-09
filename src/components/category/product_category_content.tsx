'use client';

import { useState } from 'react';
import { ProductItem, ByCategoryProductApiResponse } from '@/types/product';
import ProductCard from '@/components/product_card';
import LayoutTemplate from "@/components/layout";

interface ProductCategoryContentProps {
    initialProducts: ByCategoryProductApiResponse;
    categorySlug: string;
    imagePrefixUrl: string;
}

export default function ProductCategoryContent({
                                                   initialProducts,
                                                   categorySlug,
                                                   imagePrefixUrl,
                                               }: ProductCategoryContentProps) {
    const [products, setProducts] = useState<ProductItem[]>(initialProducts.data || []);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(21);
    const [hasMore, setHasMore] = useState((initialProducts.data?.length || 0) === 21);

    const LIMIT = 21;

    const loadMore = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const queryParams = new URLSearchParams({
                categorySlug,
                sortBy: 'price_desc',
                minPrice: '0',
                maxPrice: '9999999999',
                limit: LIMIT.toString(),
                offset: offset.toString(),
            });

            const res = await fetch(`${baseUrl}/api/product/category?${queryParams}`);
            const data: ByCategoryProductApiResponse = await res.json();

            if (data.success && data.data && data.data.length > 0) {
                // Avoid duplicates
                const existingIds = new Set(products.map(p => p.product_id));
                const newProducts = data.data.filter(p => !existingIds.has(p.product_id));

                if (newProducts.length > 0) {
                    setProducts(prev => [...prev, ...newProducts]);
                    setOffset(prev => prev + LIMIT);
                }

                // If we got less than LIMIT, no more data
                if (data.data.length < LIMIT) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more products:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle initial error
    if (!initialProducts.success) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800">
                    {initialProducts.error || 'Failed to load products'}
                </p>
            </div>
        );
    }

    // Empty state
    if (products.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg mb-2">No products found</p>
                <p className="text-gray-500">Check back later for new items</p>
            </div>
        );
    }

    return (
        <LayoutTemplate>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                {products.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        product={product}
                        imagePrefixUrl={imagePrefixUrl}
                    />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <div className="text-center mt-6 text-gray-500 text-sm">
                    No more products to load
                </div>
            )}
        </LayoutTemplate>
    );
}