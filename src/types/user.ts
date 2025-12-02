export interface AuthApiResponse {
    success: boolean;
    code: number;
    data?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    first_name: string;
    last_name?: string | null;
    email: string;
    password: string;
}