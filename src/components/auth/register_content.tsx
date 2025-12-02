import { useState } from "react";
import PrimaryBtn from "@/components/primary_btn";
import { Mail } from "lucide-react";
import { userService } from "@/services/user_service";
import { RegisterPayload } from "@/types/user";
import Toast from "@/components/toast";

interface RegisterContentProps {
    onClose: () => void;
}

export default function RegisterContent({onClose}: RegisterContentProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleRegister = async () => {
        setErrorMsg(null);
        if (loading) return;

        if (!firstName || !email || !password) {
            setErrorMsg("Please fill in all required fields.");
            return;
        }

        const payload: RegisterPayload = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        };

        setLoading(true);

        const res = await userService.register(payload);

        setLoading(false);

        if (!res.success) {
            setToast({ type: "error", message: res.data ?? "Registration failed" });
            return;
        }

        setToast({ type: "success", message: "Registration successful!" });

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

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Register new account</h2>

            {errorMsg && (
                <p className="text-sm text-red-600 bg-red-100 border border-red-200 rounded-md p-2">
                    {errorMsg}
                </p>
            )}

            <input
                type="text"
                placeholder="First Name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <input
                type="text"
                placeholder="Last Name (optional)"
                value={lastName ?? ""}
                onChange={(e) => setLastName(e.target.value || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <input
                type="password"
                placeholder="Password (min. 8 characters) *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <PrimaryBtn
                icon={Mail}
                title="Register"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                loading={loading}
                onClick={handleRegister}
            />
        </div>
    );
}
