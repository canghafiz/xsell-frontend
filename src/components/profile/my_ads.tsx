'use client';

import { useEffect, useState, useCallback } from "react";
import productService from "@/services/product_service";
import cookiesService from "@/services/cookies_service";
import { MyProductItem } from "@/types/product";
import { User } from "@/types/user";
import CardAds from "@/components/profile/card_ads";
import ModalDialog from "@/components/modal_dialog";
import { usePostStore } from "@/stores/post_store";
import EmptyStateMyAds from "@/components/profile/empt_state_my_ads";
import {useRouter} from "next/navigation";
import {MapItem} from "@/types/map";

export default function MyAds() {
    const [products, setProducts] = useState<MyProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { setProduct, setLocation } = usePostStore();

    // 🔴 delete dialog state
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    /** ======================
     *  Confirm Delete
     *  ====================== */
    const handleConfirmDelete = async () => {
        if (!selectedProductId) return;

        try {
            setDeleteLoading(true);

            const loginData = cookiesService.getCookie("login_data");
            if (!loginData) {
                throw new Error("Access token not found");
            }

            const res = await productService.deleteProduct(
                selectedProductId,
                loginData
            );

            if (!res.success) {
                console.warn("Delete failed:", res);
                return;
            }

            // 🔥 refresh list
            await fetchMyAds();

            // close dialog
            setOpenDelete(false);
            setSelectedProductId(null);

        } catch (error) {
            console.error("Delete product error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-sm text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold mb-4">My Ads</h1>

            {products.length === 0 ? (
                <EmptyStateMyAds />
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
                            onUpdate={async (data) => {
                                const productRes = await productService.getDetailBySlug(data.slug);

                                if (productRes.data) {
                                    const theItem = productRes.data;

                                    // Update cookie
                                    cookiesService.setCookie("post_category ", JSON.stringify({
                                        id: theItem.sub_category.category.category_id,
                                        slug: theItem.sub_category.category.category_slug,
                                    }))

                                    // Update post store
                                    setProduct(theItem);
                                    setLocation({
                                        longitude: theItem.location.longitude,
                                        latitude: theItem.location.latitude,
                                        address: theItem.location.address,
                                    } as MapItem)
                                }

                                const postCategoryCookie = cookiesService.getCookie("post_category");
                                if (postCategoryCookie) {
                                    router.push("/post")
                                }
                            }}
                            onDelete={(data) => {
                                setSelectedProductId(data.product_id);
                                setOpenDelete(true);
                            }}
                            onStatusUpdated={async () => {
                                await fetchMyAds();
                            }}
                        />

                    ))}
                </div>
            )}

            {/* 🔴 DELETE CONFIRM MODAL */}
            <ModalDialog
                open={openDelete}
                title="Delete Ads"
                description="Are you sure wanna delete this ads? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                loading={deleteLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setOpenDelete(false);
                    setSelectedProductId(null);
                }}
            />
        </div>
    );
}