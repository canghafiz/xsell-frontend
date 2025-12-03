import { useState, useEffect } from "react";
import PrimaryBtn from "@/components/primary_btn";
import { Mail, Lock } from "lucide-react";
import Toast from "@/components/toast";
import { userService } from "@/services/user_service";

interface ForgotPasswordContentProps {
    onClose: () => void;
}

export default function ForgotPasswordContent({ onClose }: ForgotPasswordContentProps) {
    const [step, setStep] = useState<"email" | "otp" | "newPassword">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [tokenPw, setTokenPw] = useState<string | null>(null);

    // Countdown timer for OTP resend
    useEffect(() => {
        if (step === "otp" && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        setCanResend(true);
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, countdown]);

    const handleSendEmail = async () => {
        if (loading) return;
        if (!email) {
            setToast({ type: "error", message: "Please enter your email address." });
            return;
        }

        setLoading(true);
        const payload = { email };

        const res = await userService.sendPwReset(payload);
        setLoading(false);

        if (!res.success) {
            setToast({
                type: "error",
                message: res.data ?? "Failed to send password reset OTP.",
            });
            return;
        }

        setToast({ type: "success", message: "OTP sent to your email!" });
        setStep("otp");
        setCountdown(60);
        setCanResend(false);
    };

    const handleResendOTP = async () => {
        if (loading || !canResend) return;

        setLoading(true);
        const payload = { email };

        const res = await userService.sendPwReset(payload);
        setLoading(false);

        if (!res.success) {
            setToast({
                type: "error",
                message: res.data ?? "Failed to resend OTP.",
            });
            return;
        }

        setToast({ type: "success", message: "OTP resent successfully!" });
        setCountdown(60);
        setCanResend(false);
    };

    const handleValidateOTP = async () => {
        if (loading) return;
        if (!otp.trim()) {
            setToast({ type: "error", message: "Please enter the OTP." });
            return;
        }

        setLoading(true);
        const payload = {
            email,
            code: otp.trim(),
        };

        const res = await userService.checkOtpPw(payload);
        setLoading(false);

        if (!res.success) {
            setToast({
                type: "error",
                message: res.data ?? "Invalid or expired OTP.",
            });
            return;
        }

        if (res.data) {
            setTokenPw(res.data);
        }
        setToast({ type: "success", message: "OTP verified!" });
        setStep("newPassword");
    };

    const handleSavePassword = async () => {
        if (loading) return;
        if (!newPassword || !confirmPassword) {
            setToast({ type: "error", message: "Please fill in both password fields." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setToast({ type: "error", message: "Passwords do not match." });
            return;
        }
        if (newPassword.length < 8) {
            setToast({ type: "error", message: "Password must be at least 8 characters long." });
            return;
        }
        if (!tokenPw) {
            setToast({ type: "error", message: "Session expired. Please restart the process." });
            return;
        }

        setLoading(true);
        const payload = {
            password: newPassword,
            confirm_password: confirmPassword,
        };

        const res = await userService.changePw(tokenPw, payload);
        setLoading(false);

        if (!res.success) {
            setToast({
                type: "error",
                message: res.data ?? "Failed to update password.",
            });
            return;
        }

        setToast({ type: "success", message: "Password updated successfully!" });
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

            {step === "email" && (
                <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Forgot Password</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Enter your email address and we&#39;ll send you an OTP to reset your password.
                    </p>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={loading}
                    />
                    <PrimaryBtn
                        icon={Mail}
                        title="Send OTP"
                        onClick={handleSendEmail}
                        variant="primary"
                        size="lg"
                        className="w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                        loading={loading}
                    />
                </>
            )}

            {step === "otp" && (
                <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enter OTP</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        We&#39;ve sent a verification code to <span className="font-medium text-gray-900">{email}</span>
                    </p>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center tracking-widest"
                        disabled={loading}
                    />
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                        {canResend ? (
                            <button
                                onClick={handleResendOTP}
                                className="text-red-600 hover:text-red-700 font-medium"
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <span className="text-gray-600">
                                Resend OTP in <span className="font-medium text-gray-900">{countdown}s</span>
                            </span>
                        )}
                    </div>
                    <PrimaryBtn
                        icon={Lock}
                        title="Validate OTP"
                        onClick={handleValidateOTP}
                        variant="primary"
                        size="lg"
                        className="w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                        disabled={loading}
                        loading={loading}
                    />
                </>
            )}

            {step === "newPassword" && (
                <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reset Password</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                    <input
                        type="password"
                        placeholder="New Password (min. 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={loading}
                    />
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs sm:text-sm text-red-600">
                            Passwords do not match
                        </p>
                    )}
                    <PrimaryBtn
                        icon={Lock}
                        title="Save Password"
                        onClick={handleSavePassword}
                        variant="primary"
                        size="lg"
                        className="w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                        disabled={
                            loading ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword ||
                            newPassword.length < 8
                        }
                        loading={loading}
                    />
                </>
            )}
        </div>
    );
}