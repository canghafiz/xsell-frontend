"use client";

import { Search, Plus } from 'lucide-react';
import LayoutTemplate from "@/components/layout";
import Brand from "@/components/brand";
import PrimaryBtn from "@/components/primary_btn";
import AuthModal from "@/components/auth/auth_modal";
import UserMenu from "@/components/user/user_menu";
import React, { useState, useRef, useEffect } from "react";
import { User } from "@/types/user";

interface HeaderProps {
    children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSellClick = () => {
        console.log("Sell button clicked!");
    };

    const handleAuthClick = () => {
        setShowAuthModal(true);
    };

    const appName = process.env.NEXT_PUBLIC_APP_NAME;

    const handlePlaceholderClick = () => {
        searchInputRef.current?.focus();
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
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <LayoutTemplate>
                    <div className="h-16 flex items-center justify-between">
                        <Brand />
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
                            <PrimaryBtn icon={Plus} title="Sell" onClick={handleSellClick} ariaLabel="Sell" />
                        </div>
                    </div>
                </LayoutTemplate>
                <hr className="border-b border-gray-200" />
                {children}
            </header>
        );
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <LayoutTemplate>
                    {/* Desktop */}
                    <div className="hidden md:flex items-center justify-between h-16 gap-4">
                        <Brand />
                        <div className="flex-1 max-w-2xl relative">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    aria-label="Search for items like car, phone, and more"
                                    className="mr-2 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                                {(!searchValue && !isSearchFocused) && (
                                    <div
                                        className="animated-placeholder"
                                        onClick={handlePlaceholderClick}
                                    >
                                        Find Car, Phone, and other ...
                                    </div>
                                )}
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
                        <div className="flex items-center justify-between h-16 gap-3">
                            <Brand />
                            <div className="flex items-center gap-2">
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

                        <div className="pb-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="block w-full pl-10 pr-3 py-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                    aria-label="Search for items like car, phone, and more"
                                />
                                {(!searchValue && !isSearchFocused) && (
                                    <div
                                        className="animated-placeholder"
                                        onClick={handlePlaceholderClick}
                                    >
                                        Find Car, Phone, and other ...
                                    </div>
                                )}
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