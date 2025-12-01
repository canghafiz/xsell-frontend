export interface MetaItem {
    meta_id: number;
    page_key: string;
    meta_name: string;
    meta_value: string;
    is_active: boolean;
}

export interface MetaApiResponse {
    success: boolean;
    code?: number;
    data: MetaItem[];
    message?: string;
}