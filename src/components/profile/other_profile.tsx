'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@/types/user";
import GeneralProfile from "@/components/profile/general_profile";
import userService from "@/services/user_service";

export default function OtherProfile() {
    const params = useParams();
    const userId = Number(params.slug);

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!userId || Number.isNaN(userId)) {
                    setUser(null);
                    return;
                }

                const res = await userService.getByUserId(userId);

                if (!res.success || !res.data) {
                    throw new Error("Failed to fetch user");
                }

                setUser(res.data);
            } catch (error) {
                console.warn("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    /* ======================
     *  Loading State
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
     *  Error State
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
    return <GeneralProfile user={user} isOwnProfile={false} />;
}
