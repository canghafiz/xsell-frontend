export interface StorageItem {
    file_name: string;
    file_url: string;
}

export interface StorageUploadApiResponse {
    success: boolean;
    code: number;
    data?: StorageItem[];
}

export interface StorageDeleteApiResponse {
    success: boolean;
    code: number;
    message: string;
}