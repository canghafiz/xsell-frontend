'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

interface WishlistBtnProps {
    productId: number;
    initialWishlist?: boolean;
}

export default function WishlistBtn({ productId, initialWishlist = false }: WishlistBtnProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialWishlist);

    const toggleWishlist = () => {
        // TODO: Panggil API untuk menyimpan ke wishlist
        setIsWishlisted(!isWishlisted);
    };

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation(); // mencegah klik menembus ke card
                toggleWishlist();
            }}
            className="cursor-pointer p-1 rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition-colors"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                size={24}
                className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
        </button>
    );
}