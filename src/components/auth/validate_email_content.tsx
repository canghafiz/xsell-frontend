import { useState, useEffect } from "react";
import PrimaryBtn from "@/components/primary_btn";
import { Mail, Lock } from "lucide-react";

interface ValidateEmailContentProps {
    onClose: () => void;
}

export default function ValidateEmailContent({ onClose }: ValidateEmailContentProps) {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);

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

    const handleSendEmail = () => {
        // TODO: API call to send OTP for email validation
        setStep("otp");
        setCountdown(60);
        setCanResend(false);
    };

    const handleResendOTP = () => {
        // TODO: API call to resend OTP
        setCountdown(60);
        setCanResend(false);
    };

    const handleValidateOTP = () => {
        // TODO: API call to validate OTP
        onClose();
    };

    return (
        <div className="space-y-3 sm:space-y-4 p-6 sm:p-8 mt-4">
            {step === "email" && (
                <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Validate Email</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Enter your email address and we&#39;ll send you a verification code.
                    </p>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <PrimaryBtn
                        icon={Mail}
                        title="Send Verification Code"
                        onClick={handleSendEmail}
                        variant="primary"
                        size="lg"
                        className="w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                    />
                </>
            )}

            {step === "otp" && (
                <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enter Verification Code</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        We&#39;ve sent a verification code to <span className="font-medium text-gray-900">{email}</span>
                    </p>
                    <input
                        type="text"
                        placeholder="Enter Code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center tracking-widest"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                        {canResend ? (
                            <button
                                onClick={handleResendOTP}
                                className="text-red-600 hover:text-red-700 font-medium"
                            >
                                Resend Code
                            </button>
                        ) : (
                            <span className="text-gray-600">
                                Resend code in <span className="font-medium text-gray-900">{countdown}s</span>
                            </span>
                        )}
                    </div>
                    <PrimaryBtn
                        icon={Lock}
                        title="Validate"
                        onClick={handleValidateOTP}
                        variant="primary"
                        size="lg"
                        className="w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
                    />
                </>
            )}
        </div>
    );
}