export interface CreatePostApiResponse {
    success: boolean;
    code: number;
    data?: string;
}

export interface ProductListingPayload {
    title: string;
    description: string;
    price: number;
    condition: string;
    status: string;
    sub_category_id: number;
    listing_user_id: number;
    images: {
        image_url: string;
        is_primary: boolean;
        order_sequence: number;
    }[];
    specs: {
        category_product_spec_id: number;
        spec_value: string;
    }[];
    location: {
        latitude: number;
        longitude: number;
        address: string;
    };
}