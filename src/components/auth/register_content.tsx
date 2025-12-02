import PrimaryBtn from "@/components/primary_btn";
import {Mail} from "lucide-react";

export default function RegisterContent() {
    return (
        <div className="space-y-4 p-8 mt-4">
            <h2 className="text-2xl font-bold text-gray-900">Register new account</h2>
            <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <PrimaryBtn
                icon={Mail}
                title="Register"
                variant="primary"
                size="lg"
                className="w-full justify-center"
            />
        </div>
    );
}