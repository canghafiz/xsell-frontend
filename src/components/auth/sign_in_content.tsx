import { useState } from "react";
import PrimaryBtn from "@/components/primary_btn";
import { Mail } from "lucide-react";
import Toast from "@/components/toast";
import { userService } from "@/services/user_service";

interface SignInContentProps {
    onForgotPassword: () => void;
    onValidateEmail: () => void;
    onClose: () => void;
}

export default function SignInContent({ onForgotPassword, onValidateEmail, onClose }: SignInContentProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleLogin = async () => {
        if (loading) return;

        if (!email || !password) {
            setToast({ type: "error", message: "Email and password are required." });
            return;
        }

        setLoading(true);
        const payload = { email, password };

        const res = await userService.login(payload);

        setLoading(false);

        if (!res.success) {
            setToast({
                type: "error",
                message: res.data ?? "Login failed"
            });
            return;
        }

        setToast({ type: "success", message: "Login successful!" });

        // Tutup modal setelah toast muncul
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="space-y-3 sm:space-y-4 p-6 sm:p-8 mt-4">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sign in to your account</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <div className="flex items-center justify-between">
                <button
                    onClick={onValidateEmail}
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                    Validate Email
                </button>

                <button
                    onClick={onForgotPassword}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
                >
                    Forgot Password?
                </button>
            </div>

            <PrimaryBtn
                icon={Mail}
                title="Sign In"
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                loading={loading}
                onClick={handleLogin}
            />

            <p className="text-xs sm:text-sm text-center text-gray-600">
                By signing in, you agree to our{" "}
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">Privacy Policy</a>.
            </p>
        </div>
    );
}
