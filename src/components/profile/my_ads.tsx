'use client';

import { useEffect, useState, useCallback } from "react";
import productService from "@/services/product_service";
import cookiesService from "@/services/cookies_service";
import { MyProductItem } from "@/types/product";
import { User } from "@/types/user";
import CardAds from "@/components/profile/card_ads";
import { usePostStore } from "@/stores/post_store";

export default function MyAds() {
    const [products, setProducts] = useState<MyProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // 🔹 sort from zustand
    const sortMyAd = usePostStore((state) => state.sortMyAd);

    /** ======================
     *  Fetch User
     *  ====================== */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();

                if (!data?.user) {
                    throw new Error("User not authenticated");
                }

                setUser(data.user);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, []);

    /** ======================
     *  Fetch My Ads
     *  ====================== */
    const fetchMyAds = useCallback(async () => {
        if (!user) return;

        setLoading(true);

        try {
            const loginData = cookiesService.getCookie('login_data');
            if (!loginData) {
                throw new Error("Access token not found");
            }

            const res = await productService.getMyProducts(
                user.user_id,
                sortMyAd,
                loginData
            );

            if (res.success) {
                setProducts(res.data ?? []);
            } else {
                console.warn(res);
            }
        } catch (error) {
            console.error("Failed to fetch my ads:", error);
        } finally {
            setLoading(false);
        }
    }, [user, sortMyAd]);

    // 🔹 refetch when user OR sort changes
    useEffect(() => {
        fetchMyAds();
    }, [fetchMyAds]);

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold mb-4">My Ads</h1>

            {products.length === 0 ? (
                <p className="text-sm text-gray-500">No ads found</p>
            ) : (
                <div
                    className="
                        grid gap-4
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >
                    {products.map((item) => (
                        <CardAds
                            key={item.product_id}
                            item={item}
                            onUpdate={(data) => {
                                console.log("Update:", data);
                                // TODO: open update modal
                            }}
                            onDelete={(data) => {
                                console.log("Delete:", data);
                                // TODO: confirm delete
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
