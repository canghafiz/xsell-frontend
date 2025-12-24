import {
    AuthApiResponse, ChangePwPayload, CheckOtpPWPayload,
    LoginPayload,
    PwResetPayload,
    RegisterPayload,
    SendOtpPayload, UpdateUserDataApiResponse, UpdateUserDataPayload,
    VerifyEmailPayload
} from "@/types/user";

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
    async logout(): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/logout", {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                },
            });

            const responseData: AuthApiResponse = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    code: responseData.code ?? res.status,
                    data: responseData.data ?? "Logout failed",
                };
            }

            return {
                success: true,
                code: responseData.code ?? 200,
                data: responseData.data,
            };
        } catch (error) {
            console.error("Logout error:", error);

            const message = error instanceof Error ? error.message : "Network error";

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
    async verifyEmail(payload: VerifyEmailPayload): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/otp/verifyEmail", {
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
            console.error("Verify email error:", error);

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
    async sendPwReset(payload: PwResetPayload): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/password/reset", {
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
            console.error("Send pw reset error:", error);

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
    async checkOtpPw(payload: CheckOtpPWPayload): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/password/check", {
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
            console.error("Check Otp Pw error:", error);

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
    async changePw(token: string, payload: ChangePwPayload): Promise<AuthApiResponse> {
        try {
            const res = await fetch("/api/user/password/change", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
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
            console.error("Change Pw error:", error);

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
    async updateData(
        token: string,
        userId: number,
        payload: UpdateUserDataPayload
    ): Promise<UpdateUserDataApiResponse> {
        try {
            const baseUrl =
                process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

            const url = new URL(`${baseUrl}/api/user?userId=${userId}`);
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseData: AuthApiResponse = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    code: responseData.code ?? res.status,
                };
            }

            return {
                success: true,
                code: responseData.code ?? 200,
            };
        } catch (error) {
            console.error("Update user data error:", error);

            return {
                success: false,
                code: 500,
            };
        }
    }
}

export const userService = new UserService();
export default userService;