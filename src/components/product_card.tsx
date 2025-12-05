'use client';

import { ProductItem } from "@/types/product";
import Image from "next/image";
import { useState } from "react";
import WishlistBtn from "@/components/wishlist_btn";
import Link from "next/link";

interface ProductCardProps {
    product: ProductItem;
    imagePrefixUrl: string;
}

export default function ProductCard({ product, imagePrefixUrl }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href={`/product/${product.product_slug}`} passHref>
            <div
                className="flex-shrink-0 w-44 cursor-pointer"
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
                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        {product.condition}
                    </span>
                    </div>

                    {/* ❤️ Wishlist button */}
                    <div className="absolute top-2 right-2">
                        <WishlistBtn productId={product.product_id}/>
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-2">
                    <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">
                        {product.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-gray-600">
                        By {product.listing.first_name}
                    </span>
                        <span className="font-bold text-sm text-gray-900">
                        Rp{product.price.toLocaleString()}
                    </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}