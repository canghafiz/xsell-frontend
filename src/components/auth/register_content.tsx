import PrimaryBtn from "@/components/primary_btn";
import {Mail} from "lucide-react";

export default function RegisterContent() {
    return (
        <div className="space-y-3 sm:space-y-4 p-6 sm:p-8 mt-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Register new account</h2>
            <input
                type="text"
                placeholder="First Name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
                type="text"
                placeholder="Last Name (optional)"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
                type="email"
                placeholder="Email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
                type="password"
                placeholder="Password (min. 8 characters)"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex items-start gap-2 pt-1">
                <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                        Privacy Policy
                    </a>
                </label>
            </div>
            <PrimaryBtn
                icon={Mail}
                title="Register"
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm sm:text-base py-2.5 sm:py-3"
            />
        </div>
    );
}