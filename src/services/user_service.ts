import {AuthApiResponse, LoginPayload, RegisterPayload, SendOtpPayload} from "@/types/user";

class UserService {
    async login(payload: LoginPayload): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const responseData: AuthApiResponse = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    code: responseData.code ?? res.status,
                    data: responseData.data ?? "Unknown error",
                };
            }

            return {
                success: true,
                code: responseData.code ?? 200,
                data: responseData.data,
            };
        } catch (error) {
            console.error("Login error:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Network error";

            return {
                success: false,
                code: 500,
                data: message,
            };
        }
    }
    async register(payload: RegisterPayload): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const responseData: AuthApiResponse = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    code: responseData.code ?? res.status,
                    data: responseData.data ?? "Unknown error",
                };
            }

            return {
                success: true,
                code: responseData.code ?? 200,
                data: responseData.data,
            };
        } catch (error) {
            console.error("Register error:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Network error";

            return {
                success: false,
                code: 500,
                data: message,
            };
        }
    }
    async sendOtp(payload: SendOtpPayload): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const responseData: AuthApiResponse = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    code: responseData.code ?? res.status,
                    data: responseData.data ?? "Unknown error",
                };
            }

            return {
                success: true,
                code: responseData.code ?? 200,
                data: responseData.data,
            };
        } catch (error) {
            console.error("Send otp error:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Network error";

            return {
                success: false,
                code: 500,
                data: message,
            };
        }
    }
}

export const userService = new UserService();
export default userService;