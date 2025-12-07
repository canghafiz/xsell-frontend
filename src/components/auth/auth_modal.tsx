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
                                    <button
                                        className="w-full py-2.5 sm:py-3 px-4 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-2 sm:gap-3 hover:bg-gray-50 transition-colors">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        <span className="font-medium text-sm sm:text-base text-gray-900">Continue with Google</span>
                                    </button>
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
                                    <button
                                        className="w-full py-2.5 sm:py-3 px-4 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-2 sm:gap-3 hover:bg-gray-50 transition-colors">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        <span className="font-medium text-sm sm:text-base text-gray-900">Continue with Google</span>
                                    </button>
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