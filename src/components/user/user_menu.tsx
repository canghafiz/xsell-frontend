import {Bell, MessageCircle, User as UserIcon, LogOut, HeartIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";
import { useState, useRef, useEffect } from "react";
import { userService } from "@/services/user_service";

interface UserMenuProps {
    user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getProfileImageUrl = () => {
        if (!user.photo_profile) return null;
        return `${process.env.NEXT_PUBLIC_STORAGE_URL}${user.photo_profile}`;
    };

    const imageUrl = getProfileImageUrl();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const result = await userService.logout();
            if (result.success) {
                window.location.reload();
            } else {
                console.error("Logout failed:", result.data);
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Messages">
                <MessageCircle className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 relative" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="cursor-pointer relative focus:outline-none"
                    aria-label="User menu"
                >
                    {imageUrl ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors">
                            <Image
                                src={imageUrl}
                                alt="Profile"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                            <UserIcon className="w-4 h-4 text-gray-600" />
                        </div>
                    )}
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <UserIcon className="w-4 h-4" />
                            <span>Profile</span>
                        </Link>
                        <Link
                            href="/my-ads"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <HeartIcon className="w-4 h-4" />
                            <span>My Ads</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}