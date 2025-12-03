export interface PageSectionItem {
    page_key: string;
    data: ProductPageSection[];
}

export interface ProductPageSection {
    section_id: number;
    section_key: string;
    title: string;
    subtitle: string;
    products: ProductItem[];
}

export interface ProductItem {
    product_id: number;
    title: string;
    price: number;
    condition: string;
    images: ProductImage[];
    location: ProductLocation;
    listing: ProductListing;
}

export interface ProductImage {
    image_id: number;
    url: string;
    is_primary: boolean;
    order_seq: number;
}

export interface ProductLocation {
    latitude: number;
    longitude: number;
}

export interface ProductListing {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string | null;
    photo_profile: string | null;
}

export interface ProductPageApiResponse {
    success: boolean;
    code: number;
    data?: PageSectionItem | null;
}