"use client";
import { Search, Plus } from 'lucide-react';
import LayoutTemplate from "@/components/layout";
import Brand from "@/components/brand";
import PrimaryBtn from "@/components/primary_btn";
import Categories from "@/components/categories";

export default function Header() {
    const handleSellClick = () => {
        console.log("Sell button clicked!");
    };

    const appName = process.env.NEXT_PUBLIC_APP_NAME

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <LayoutTemplate>
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Brand />
                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                type="text"
                                placeholder="Find Car, Phone, and other ..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* SignIn/SignUp & Sell Btn */}
                    <div className="flex items-center gap-3">
                        {/* SignIn/SignUp - Hidden on mobile */}
                        <button
                            className="cursor-pointer hidden md:block text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
                            SignIn/SignUp
                        </button>

                        {/* Sell Button */}
                        <PrimaryBtn
                            icon={Plus}
                            title="Sell"
                            onClick={handleSellClick}
                            ariaLabel={"Start selling your items on " + appName}
                        />
                    </div>
                </div>
                <Categories/>
            </LayoutTemplate>
        </header>
    );
}