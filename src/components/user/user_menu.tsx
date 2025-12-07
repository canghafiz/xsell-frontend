"use client";

import { Bell, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user"; // sesuaikan path

interface UserMenuProps {
    user: User; // pastikan tipe sesuai
}

export default function UserMenu({ user }: UserMenuProps) {
    const getProfileImageUrl = (url: string | null) => {
        if (!url) return null;
        return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_STORAGE_URL}${url}`;
    };

    const profileImageUrl = getProfileImageUrl(user.photo_profile);

    return (
        <div className="flex items-center gap-3">
            {/* Messages */}
            <button
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Messages"
            >
                <MessageCircle className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 relative"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Profile */}
            <Link href="/profile" className="relative" aria-label="Your profile">
                {profileImageUrl ? (
                    <Image
                        src={profileImageUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover border border-gray-300"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {user.first_name.charAt(0).toUpperCase()}
            </span>
                    </div>
                )}
            </Link>
        </div>
    );
}