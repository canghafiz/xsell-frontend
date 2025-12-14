export interface MapItem {
    longitude: number;
    latitude: number;
    address: string;
}

export interface ToAddressApiResponse {
    success: boolean;
    code: number;
    data?: MapItem | null;
}

export interface AutoCompleteApiResponse {
    success: boolean;
    code: number;
    data?: MapItem[] | null;
}