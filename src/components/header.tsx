"use client";

import { Search, Plus } from 'lucide-react';
import LayoutTemplate from "@/components/layout";
import Brand from "@/components/brand";
import PrimaryBtn from "@/components/primary_btn";
import AuthModal from "@/components/auth/auth_modal";
import UserMenu from "@/components/user/user_menu";
import React, { useState, useRef, useEffect } from "react";
import { User } from "@/types/user";
import DropdownMapLocation from "@/components/map/dropdown_map_location";
import { useRouter, useSearchParams } from 'next/navigation';
import Toast from "@/components/toast";

interface HeaderProps {
    children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Sync search input with URL parameter
    useEffect(() => {
        const titleParam = searchParams.get('title');
        if (titleParam) {
            setSearchValue(titleParam);
        }
    }, [searchParams]);

    const handleSellClick = () => {
        if (!user) {
            setToast({
                type: "error",
                message: "Please sign in first to start selling."
            });
            return;
        }

        router.push("/post");
    };


    const handleAuthClick = () => {
        setShowAuthModal(true);
    };

    const appName = process.env.NEXT_PUBLIC_APP_NAME;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = searchValue.trim();
            const newUrl = `/search?title=${encodeURIComponent(trimmed)}&categorySlug=all&subCategorySlug=all`;

            if (window.location.pathname === '/search') {
                window.location.href = newUrl;
            } else {
                router.push(newUrl);
            }
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const { user } = await res.json();
                setUser(user);
            } catch (e) {
                console.warn("Failed to fetch user", e);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <>
                {toast && (
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                )}

                <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                    <LayoutTemplate>
                        <div className="h-16 flex items-center justify-between">
                            <Brand />
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
                                <PrimaryBtn
                                    type="button"
                                    icon={Plus}
                                    title="Sell"
                                    onClick={handleSellClick}
                                    ariaLabel="Sell"
                                />
                            </div>
                        </div>
                    </LayoutTemplate>
                    <hr className="border-b border-gray-200" />
                    {children}
                </header>
            </>
        );
    }

    return (
        <>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <LayoutTemplate>
                    {/* Desktop */}
                    <div className="hidden md:flex items-center justify-between h-16 gap-4">
                        <Brand />
                        <DropdownMapLocation />
                        <div className="flex-1 max-w-3xl">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Find Car, Phone, and other..."
                                    aria-label="Search for items"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {user ? (
                                <UserMenu user={user} />
                            ) : (
                                <button
                                    onClick={handleAuthClick}
                                    className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium text-sm"
                                >
                                    SignIn/SignUp
                                </button>
                            )}
                            <PrimaryBtn
                                icon={Plus}
                                title="Sell"
                                onClick={handleSellClick}
                                ariaLabel={`Start selling your items on ${appName}`}
                            />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        <div className="flex items-center justify-between h-14">
                            <Brand />
                            <div className="flex items-center gap-2">
                                {user ? (
                                    <UserMenu user={user} />
                                ) : (
                                    <button
                                        onClick={handleAuthClick}
                                        className="text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap"
                                    >
                                        Sign In
                                    </button>
                                )}
                                <PrimaryBtn
                                    icon={Plus}
                                    title="Sell"
                                    onClick={handleSellClick}
                                    ariaLabel={`Sell on ${appName}`}
                                    className="!px-2 !py-1 text-xs"
                                />
                            </div>
                        </div>

                        <div className="py-2">
                            <DropdownMapLocation />
                        </div>

                        <div className="pb-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Find Car, Phone, and other..."
                                    aria-label="Search for items"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </LayoutTemplate>
                <hr className="border-b border-gray-200" />
                {children}
            </header>

            {showAuthModal && (
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </>
    );
}
