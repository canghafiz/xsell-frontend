'use client';

import { useEffect, useState, useCallback } from "react";
import wishlistService from "@/services/wishlist_service";
import cookiesService from "@/services/cookies_service";
import { WishlistItem, WishlistItemApiResponse } from "@/types/wishlist";
import { User } from "@/types/user";
import { usePostStore } from "@/stores/post_store";
import Image from "next/image";
import WishlistBtn from "@/components/wishlist_btn";

export default function MyFavorites() {
    const [favorites, setFavorites] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const sortMyAd = usePostStore((state) => state.sortMyAd);

    // 🔹 Fetch Authenticated User
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (!data?.user) throw new Error("User not authenticated");
                setUser(data.user);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, []);

    // 🔹 Fetch Favorites / Wishlist
    const fetchFavorites = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const accessToken = cookiesService.getCookie('login_data');
            if (!accessToken) throw new Error("Access token not found");

            const res: WishlistItemApiResponse = await wishlistService.getWishlist(
                user.user_id,
                sortMyAd,
                accessToken
            );

            if (res.success && res.data) {
                setFavorites(res.data);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, [user, sortMyAd]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading favorites...</div>;
    }

    if (favorites.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                You don&#39;t have any favorites yet.
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold mb-4">My Favorites</h1>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {favorites.map((item) => (
                    <div
                        key={item.product_id}
                        className="cursor-pointer relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                    >
                        {/* 🔹 Wishlist button top-right */}
                        <div className="absolute top-2 right-2 z-10">
                            <WishlistBtn productId={item.product_id} initialWishlist={true} onWishlistToggled={fetchFavorites} />
                        </div>

                        {/* 🔹 Product image */}
                        <div className="relative w-full h-48">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${item.main_image}` || '/placeholder.png'}
                                alt={item.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>

                        {/* 🔹 Product info */}
                        <div className="p-3">
                            <h2 className="font-semibold text-sm truncate">{item.title}</h2>
                            <p className="text-gray-500 text-xs mt-1">Views: {item.view_count}</p>
                            <p className="text-gray-500 text-xs mt-1">Likes: {item.total_like}</p>
                            <p className="font-semibold mt-2">${item.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
