export interface AuthApiResponse {
    success: boolean;
    code: number;
    data?: string | null;
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

export interface SendOtpPayload {
    email: string;
}

export interface VerifyEmailPayload {
    email: string;
    code: string;
}

export interface PwResetPayload {
    email: string;
}

export interface CheckOtpPWPayload {
    email: string;
    code: string;
}

export interface ChangePwPayload {
    password: string;
    confirm_password: string;
}

export interface User{
    user_id: number;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    photo_profile: string;
    created_at: string;
}