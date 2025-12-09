'use client';

import { ProductItem } from "@/types/product";
import Image from "next/image";
import { useState } from "react";
import WishlistBtn from "@/components/wishlist_btn";
import Link from "next/link";
import { formatCurrency } from "@/utils/currency";

interface ProductCardProps {
    product: ProductItem;
    imagePrefixUrl: string;
    forGrid?: boolean;
}

export default function ProductCard({ product, imagePrefixUrl, forGrid = false }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Format price dynamically
    const formattedPrice = formatCurrency(product.price);

    return (
        forGrid ? <Link href={`/product/${product.product_slug}`} className="block w-full">
            <div
                className="w-full cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container - Square aspect ratio */}
                <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300" style={{ paddingBottom: '100%' }}>
                    {/* Main image */}
                    <div className="absolute inset-0">
                        <Image
                            src={imagePrefixUrl + product.images[0]?.url}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                            className={`object-cover transition-opacity duration-300 ${
                                isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
                            }`}
                            style={{ width: '100%', height: '100%' }}
                            unoptimized
                        />
                    </div>

                    {/* Hover image */}
                    {product.images.length > 1 && (
                        <div className="absolute inset-0">
                            <Image
                                src={imagePrefixUrl + product.images[1].url}
                                alt={`${product.title} hover`}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                                className={`object-cover transition-opacity duration-300 ${
                                    isHovered ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{ width: '100%', height: '100%' }}
                                unoptimized
                            />
                        </div>
                    )}

                    {/* Condition badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                            {product.condition}
                        </span>
                    </div>

                    {/* Wishlist button */}
                    <div className="absolute top-3 right-3 z-10">
                        <WishlistBtn productId={product.product_id} />
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-3 px-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
                        {product.title}
                    </h3>
                    <div className="flex justify-between items-center gap-2 mt-2">
                        <span className="text-xs text-gray-600 truncate flex-shrink min-w-0">
                            By {product.listing.first_name}
                        </span>
                        <span className="font-bold text-base text-gray-900 whitespace-nowrap flex-shrink-0">
                            {formattedPrice}
                        </span>
                    </div>
                </div>
            </div>
        </Link> : <Link href={`/product/${product.product_slug}`} passHref>
            <div
                className="flex-shrink-0 w-54 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative pb-[100%] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                    {/* Main image */}
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-100">
                        <Image
                            src={imagePrefixUrl + product.images[0]?.url}
                            alt={product.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Hover image */}
                    {product.images.length > 1 && (
                        <div
                            className={`absolute inset-0 transition-opacity duration-300 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <Image
                                src={imagePrefixUrl + product.images[1].url}
                                alt={`${product.title} hover`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    )}

                    {/* Condition badge */}
                    <div className="absolute top-2 left-2">
                        <span className="bg-red-600 text-white text-[11px] px-2 py-1 rounded-full font-medium">
                            {product.condition}
                        </span>
                    </div>

                    {/* Wishlist button */}
                    <div className="absolute top-2 right-2">
                        <WishlistBtn productId={product.product_id} />
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                        {product.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600">
                            By {product.listing.first_name}
                        </span>
                        {/* Dynamic currency formatting */}
                        <span className="font-bold text-base text-gray-900">
                            {formattedPrice}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}