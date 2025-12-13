import {SubCategoryItem} from "@/types/category";

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
    product_slug: string;
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
    address: string;
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

export interface ProductSpec {
    spec_id: number;
    spec_type_title: string;
    name: string;
    value: string;
    category: string;
}

export interface ProductDetailItem {
    product_id: number;
    product_slug: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    status: string;
    sub_category: SubCategoryItem;
    images: ProductImage[];
    specs: ProductSpec[];
    location: ProductLocation;
    listing: ProductListing;
    created_at: string;
}

export interface ProductDetailApiResponse {
    success: boolean;
    code: number;
    data?: ProductDetailItem | null;
    error?: string;
}

export interface RelatedProductApiResponse {
    success: boolean;
    code: number;
    data?: ProductItem[];
    error?: string;
}

export interface ByCategoryProductApiResponse {
    success: boolean;
    code: number;
    data?: ProductItem[];
    error?: string;
}