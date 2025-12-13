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

    const containerClass = forGrid
        ? "block w-full"
        : "block flex-shrink-0 w-54";

    const cardClass = forGrid
        ? "w-full cursor-pointer"
        : "flex-shrink-0 w-54 cursor-pointer";

    const imageContainerClass = forGrid
        ? "relative w-full bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        : "relative pb-[100%] rounded-2xl overflow-hidden bg-gray-100 shadow-sm";

    const badgePositionClass = forGrid ? "top-3 left-3" : "top-2 left-2";
    const wishlistPositionClass = forGrid ? "top-3 right-3" : "top-2 right-2";
    const badgeTextClass = forGrid
        ? "text-xs px-2.5 py-1 rounded-full"
        : "text-[11px] px-2 py-1 rounded-full";

    const productInfoClass = forGrid ? "mt-3 px-1" : "mt-3";
    const titleClass = forGrid
        ? "text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]"
        : "text-sm font-medium text-gray-900 line-clamp-2 leading-tight";

    const sellerPriceClass = forGrid
        ? "flex justify-between items-center gap-2 mt-2"
        : "flex justify-between items-center mt-2";

    const sellerNameClass = forGrid
        ? "text-xs text-gray-600 truncate flex-shrink min-w-0"
        : "text-xs text-gray-600";

    return (
        <Link href={`/product/${product.product_slug}`} className={containerClass}>
            <div
                className={cardClass}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className={imageContainerClass} style={forGrid ? { paddingBottom: '100%' } : undefined}>
                    {/* Main image */}
                    <div className="absolute inset-0">
                        <Image
                            src={imagePrefixUrl + product.images[0]?.url}
                            alt={product.title}
                            fill
                            sizes={forGrid ? "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw" : undefined}
                            className={`object-cover transition-opacity duration-300 ${
                                isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
                            }`}
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
                                sizes={forGrid ? "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw" : undefined}
                                className={`object-cover transition-opacity duration-300 ${
                                    isHovered ? 'opacity-100' : 'opacity-0'
                                }`}
                                unoptimized
                            />
                        </div>
                    )}

                    {/* Condition badge */}
                    <div className={`absolute z-10 ${badgePositionClass}`}>
          <span className={`bg-red-600 text-white ${badgeTextClass} font-medium shadow-sm`}>
            {product.condition}
          </span>
                    </div>

                    {/* Wishlist button */}
                    <div className={`absolute z-10 ${wishlistPositionClass}`}>
                        <WishlistBtn productId={product.product_id} />
                    </div>
                </div>

                {/* Product Info */}
                <div className={productInfoClass}>
                    <h3 className={titleClass}>{product.title}</h3>
                    <div className={sellerPriceClass}>
                        <span className={sellerNameClass}>By {product.listing.first_name}</span>
                        <span className="font-bold text-base text-gray-900 whitespace-nowrap flex-shrink-0">
            {formattedPrice}
          </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}