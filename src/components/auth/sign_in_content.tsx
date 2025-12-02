import PrimaryBtn from "@/components/primary_btn";
import { Mail } from "lucide-react";

interface SignInContentProps {
    onForgotPassword: () => void;
    onValidateEmail: () => void;
}

export default function SignInContent({ onForgotPassword, onValidateEmail }: SignInContentProps) {
    return (
        <div className="space-y-3 sm:space-y-4 p-6 sm:p-8 mt-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sign in to your account</h2>

            <input
                type="email"
                placeholder="Email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {/* Buttons: Forgot Password + Validate Email */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onValidateEmail}
                    className="cursor-pointer text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                    Validate Email
                </button>

                <button
                    onClick={onForgotPassword}
                    className="cursor-pointer text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
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
