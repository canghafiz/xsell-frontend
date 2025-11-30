import { Search, Plus } from 'lucide-react';
import LayoutTemplate from "@/components/layout";
import Image from 'next/image';

export default function Header() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <LayoutTemplate>
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Image
                            src="/brand.png"
                            alt={appName + " Logo "}
                            width={124}
                            height={124}
                            className="hidden sm:block"
                            priority
                        />
                        <Image
                            src="/brand-small.png"
                            alt={appName + " Logo "}
                            width={40}
                            height={40}
                            className="sm:hidden"
                            priority
                        />
                    </div>

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
                            className="hidden md:block text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
                            SignIn/SignUp
                        </button>

                        {/* Sell Button */}
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors">
                            <Plus className="h-5 w-5"/>
                            <span className="hidden sm:inline">Sell</span>
                        </button>
                    </div>
                </div>
            </LayoutTemplate>
        </header>
    );
}