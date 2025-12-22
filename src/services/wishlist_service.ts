import {
    CheckWishlistApiResponse,
    UpdateWishlistApiResponse, WishlistItem,
    WishlistItemApiResponse,
    WishlistPayload
} from "@/types/wishlist";

class WishlistService {
    async updateWishlist(
        payload: WishlistPayload,
        accessToken: string
    ): Promise<UpdateWishlistApiResponse> {

        if (!payload?.user_id || !payload?.product_id) {
            return {
                success: false,
                code: 400,
            };
        }

        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        const url = new URL(`${baseUrl}/api/wishlist`);

        try {
            const res = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            });

            if (!res.ok) {
                try {
                    const errorData = await res.json();
                    return errorData as UpdateWishlistApiResponse;
                } catch {
                    return {
                        success: false,
                        code: res.status,
                    };
                }
            }

            const data = await res.json();
            return data as UpdateWishlistApiResponse;

        } catch (error) {
            console.error("Update Wishlist error:", error);
            return {
                success: false,
                code: 500,
            };
        }
    }
    async checkWishlist(
        payload: WishlistPayload,
        accessToken: string
    ): Promise<CheckWishlistApiResponse> {

        if (!payload?.user_id || !payload?.product_id) {
            return {
                success: false,
                code: 400,
                data: false,
            };
        }

        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        // 🔎 Build query params
        const url = new URL(`${baseUrl}/api/wishlist/check`);
        url.searchParams.set('userId', String(payload.user_id));
        url.searchParams.set('productId', String(payload.product_id));

        try {
            const res = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                cache: 'no-store',
            });

            if (!res.ok) {
                try {
                    const errorData = await res.json();
                    return errorData as CheckWishlistApiResponse;
                } catch {
                    return {
                        success: false,
                        code: res.status,
                        data: false,
                    };
                }
            }

            const data = await res.json();
            return data as CheckWishlistApiResponse;

        } catch (error) {
            console.error('Check Wishlist error:', error);
            return {
                success: false,
                code: 500,
                data: false,
            };
        }
    }
    async getWishlist(
        userId: number,
        sortBy: string,
        accessToken: string
    ): Promise<WishlistItemApiResponse> {

        if (!userId) {
            return {
                success: false,
                code: 400,
                data: [],
            };
        }

        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        // 🔎 Build URL with query params
        const url = new URL(`${baseUrl}/api/wishlist/user`);
        url.searchParams.set("userId", String(userId));
        if (sortBy) {
            url.searchParams.set("sortBy", sortBy);
        }

        try {
            const res = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                cache: "no-store",
            });

            if (!res.ok) {
                try {
                    const errorData = await res.json();
                    return {
                        success: false,
                        code: res.status,
                        data: [],
                        ...errorData,
                    } as WishlistItemApiResponse;
                } catch {
                    return {
                        success: false,
                        code: res.status,
                        data: [],
                    };
                }
            }

            const data = await res.json();

            // ✅ Map backend data if necessary
            const items: WishlistItem[] = (data.data || []).map((item: WishlistItem) => ({
                product_id: item.product_id,
                slug: item.slug,
                title: item.title,
                view_count: item.view_count,
                main_image: item.main_image,
                total_like: item.total_like,
                price: item.price,
                status: item.status,
                created_at: item.created_at,
            }));

            return {
                success: true,
                code: 200,
                data: items,
            };
        } catch (error) {
            console.error("Get Wishlist error:", error);
            return {
                success: false,
                code: 500,
                data: [],
            };
        }
    }
}

export const wishlistService = new WishlistService();
export default wishlistService;