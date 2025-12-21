'use client';

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import GeneralProfile from "@/components/profile/general_profile";

export default function MyProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');

                if (!res.ok) {
                    throw new Error('Unauthorized');
                }

                const data = await res.json();
                setUser(data.user ?? null);
            } catch (error) {
                console.warn("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    /* ======================
     *  Loading State (Centered)
     * ====================== */
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
                    Loading profile...
                </div>
            </div>
        );
    }

    /* ======================
     *  Error / Not Logged In
     * ====================== */
    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-red-500">
                Failed to load profile
            </div>
        );
    }

    /* ======================
     *  Profile Loaded
     * ====================== */
    return <GeneralProfile user={user} isOwnProfile={true} />;
}
