export interface ProductSpecItem {
    id: number;
    main_title: string;
    name: string;
}

export interface ProductSpecApiResponse {
    success: boolean;
    code: number;
    data?: ProductSpecItem[];
}