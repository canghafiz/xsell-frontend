import {useState} from "react";
import {Mail, X, ArrowLeft} from "lucide-react";
import PrimaryBtn from "@/components/primary_btn";
import Image from "next/image";
import SignInContent from "@/components/auth/sign_in_content";
import RegisterContent from "@/components/auth/register_content";
import ForgotPasswordContent from "@/components/auth/forgot_password_content";
import ValidateEmailContent from "@/components/auth/validate_email_content";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<"Sign In" | "Sign Up">("Sign In");
    const [activeContent, setActiveContent] = useState<"Sign In" | "Sign Up" | "Main" | "ForgotPassword" | "ValidateEmail">("Main");

    const setToSignInContent = () => {
        setActiveContent("Sign In");
    }

    const setToRegisterContent = () => {
        setActiveContent("Sign Up");
    }

    const setToForgotPassword = () => {
        setActiveContent("ForgotPassword");
    }

    const setToValidateEmail = () => {
        setActiveContent("ValidateEmail");
    }

    const backToMain = () => {
        setActiveContent("Main");
    }

    if (!isOpen) return null;

    const appName = process.env.NEXT_PUBLIC_APP_NAME

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
                 onClick={(e) => e.stopPropagation()}
            >
                {/* Header Buttons */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    {/* Back Button - Only show when not on Main */}
                    {activeContent !== "Main" && (
                        <button
                            onClick={backToMain}
                            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Back"
                        >
                            <ArrowLeft className="h-6 w-6"/>
                        </button>
                    )}

                    {/* Spacer when on Main screen */}
                    {activeContent === "Main" && <div></div>}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-6 w-6"/>
                    </button>
                </div>

                {/* Content */}
                {activeContent === "Main" ? (
                    <div className="p-6 sm:p-8">
                        {/* Brand */}
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <Image
                                src="/brand-small.png"
                                alt={appName + " Logo"}
                                width={0}
                                height={0}
                                className="h-8 sm:h-10 w-auto"
                                priority
                                sizes="100vw"
                                style={{width: 'auto', height: '2rem'}}
                            />
                        </div>

                        {/* Title */}
                        <h1 className="text-center text-base sm:text-xl font-semibold text-gray-500 mb-4 sm:mb-6">
                            Help make {appName} a safer marketplace
                        </h1>

                        {/* Tabs */}
                        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <button
                                onClick={() => setActiveTab("Sign In")}
                                className={`cursor-pointer flex-1 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                                    activeTab === "Sign In"
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setActiveTab("Sign Up")}
                                className={`cursor-pointer flex-1 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                                    activeTab === "Sign Up"
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Auth Options */}
                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                            {activeTab === "Sign In" ? (
                                <>
                                    <PrimaryBtn
                                        icon={Mail}
                                        onClick={setToSignInContent}
                                        title="Sign in with email"
                                        variant="outline"
                                        size="lg"
                                        className="w-full justify-center border-gray-300 text-gray-900 hover:bg-gray-50 text-sm sm:text-base py-2.5 sm:py-3"
                                    />
                                </>
                            ) : (
                                <>
                                    <PrimaryBtn
                                        icon={Mail}
                                        onClick={setToRegisterContent}
                                        title="Sign up with email"
                                        variant="outline"
                                        size="lg"
                                        className="w-full justify-center border-gray-300 text-gray-900 hover:bg-gray-50 text-sm sm:text-base py-2.5 sm:py-3"
                                    />
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <p className="text-center text-[10px] sm:text-xs text-gray-600">
                            We will not share your personal details with anyone.
                        </p>
                        <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-2 sm:mt-3">
                            By signing in, you agree to our{" "}
                            <a href="#" className="text-red-600 hover:underline">
                                Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-red-600 hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                ) : activeContent === "Sign In" ? (
                    <SignInContent onClose={onClose} onForgotPassword={setToForgotPassword} onValidateEmail={setToValidateEmail}/>
                ) : activeContent === "Sign Up" ? (
                    <RegisterContent onClose={onClose}/>
                ) : activeContent === "ForgotPassword" ? (
                    <ForgotPasswordContent onClose={onClose}/>
                ) : (
                    <ValidateEmailContent onClose={onClose}/>
                )}
            </div>
        </div>
    );
}