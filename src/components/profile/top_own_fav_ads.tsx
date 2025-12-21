'use client'
import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useRouter, usePathname } from "next/navigation";

const buttonVariants = cva(
    "cursor-pointer font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
                secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
                outline: "border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500",
                ghost: "text-red-600 hover:bg-red-50 focus:ring-red-500",
                danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
            },
            size: {
                sm: "px-6 py-1.5 text-xs rounded",
                md: "px-10 py-2 rounded-lg",
                lg: "px-14 py-3 text-base rounded-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

type SortValue = 'new_to_oldest' | 'oldest_to_new' | 'most_liked';

export default function TopOwnFavAds({
                                         variant,
                                         size,
                                     }: VariantProps<typeof buttonVariants>) {
    const router = useRouter();
    const pathname = usePathname();

    const isAds = pathname === '/my-ads';
    const isFavorites = pathname === '/my-favorite';

    const [sortBy, setSortBy] = useState<SortValue>('new_to_oldest');

    return (
        <div
            className="
                flex flex-col gap-3
                sm:flex-row sm:items-center sm:justify-between
                mb-3
            "
        >
            {/* Left buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
                <button
                    type="button"
                    onClick={() => router.push('/my-ads')}
                    aria-label="ads-btn"
                    className={buttonVariants({
                        variant: isAds ? variant : 'outline',
                        size,
                    })}
                >
                    Ads
                </button>

                <button
                    type="button"
                    onClick={() => router.push('/my-favorite')}
                    aria-label="favorite-btn"
                    className={buttonVariants({
                        variant: isFavorites ? variant : 'outline',
                        size,
                    })}
                >
                    Favorites
                </button>
            </div>

            {/* Sort By */}
            <div
                className="
                    flex items-center gap-2
                    w-full sm:w-auto
                "
            >
                <span className="text-sm text-gray-500 hidden sm:block">
                    Sort by
                </span>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortValue)}
                    className="
                        w-full sm:w-auto
                        border border-gray-300 rounded-lg
                        px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-red-500
                    "
                >
                    <option value="new_to_oldest">Newest to Oldest</option>
                    <option value="oldest_to_new">Oldest to Newest</option>
                    <option value="most_liked">Most Liked</option>
                </select>
            </div>
        </div>
    );
}
