export interface UpdateWishlistApiResponse {
    success: boolean;
    code: number;
}

export interface WishlistPayload {
    user_id: number;
    product_id: number;
}

export interface CheckWishlistApiResponse {
    success: boolean;
    code: number;
    data: boolean;
}

export interface WishlistItem {
    product_id: number;
    slug: string;
    title: string;
    view_count: number;
    main_image: string;
    total_like: number;
    price: number;
    status: string;
    created_at: string;
}

export interface WishlistItemApiResponse {
    success: boolean;
    code: number;
    data?: WishlistItem[];
}