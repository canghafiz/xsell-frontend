"use client";

import { useRef } from "react";
import ProductCard from "@/components/product_card";
import {ProductItem} from "@/types/product";

export default function ScrollableSectionClient({
                                                    products,
                                                    imagePrefixUrl
                                                }: {
    products: ProductItem[];
    imagePrefixUrl: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="px-2 relative">
            {/* Previous Button - Desktop Only */}
            <button
                onClick={() => scroll('left')}
                className="cursor-pointer hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white"
                aria-label="Scroll left"
            >
                ←
            </button>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto space-x-4 pb-2 hide-scrollbar"
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        product={product}
                        imagePrefixUrl={imagePrefixUrl}
                    />
                ))}
            </div>

            {/* Next Button - Desktop Only */}
            <button
                onClick={() => scroll('right')}
                className="cursor-pointer hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white"
                aria-label="Scroll right"
            >
                →
            </button>
        </div>
    );
}