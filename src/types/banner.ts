export interface BannerItem {
    banner_id: number;
    sequence: number;
    image_url: string;
    link: string;
    title: string;
    description: string;
}

export interface BannerApiResponse {
    success: boolean;
    code?: number;
    data: BannerItem[];
}