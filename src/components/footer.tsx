"use client"
import LayoutTemplate from "@/components/layout";
import Image from "next/image";
import {MailCheckIcon} from "lucide-react";
import PrimaryBtn from "@/components/primary_btn";

export default function Footer() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";

    const handleSubsClick = () => {
        console.log("Subs button clicked!");
    };

    return (
        <footer className="bg-black text-white py-12">
            <LayoutTemplate>
                {/* Main Footer Grid - 3 Columns with Better Proportions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    {/* Left Column - Brand & Description (5 columns) */}
                    <div className="md:col-span-5">
                        <Image
                            src="/brand.png"
                            alt={appName + " Logo"}
                            width={0}
                            height={0}
                            priority
                            sizes="100vw"
                            style={{width: 'auto', height: '2.5rem'}}
                        />
                        <p className="text-sm text-gray-300 leading-relaxed mt-4">
                            Discover, trade, and trust. From smartphones to scooters, list or find pre-loved gems in minutes. Every deal is protected, every user verified. Buy smarter, sell faster — all in a marketplace built on real trust.
                        </p>
                    </div>

                    {/* Middle Column - Quick Links (2 columns) */}
                    <div className="md:col-span-2">
                        <h1 className="text-base font-semibold mb-4">Quick Link</h1>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms Of Use</a></li>
                            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact</a></li>
                        </ul>
                    </div>

                    {/* Right Column - Subscribe (5 columns) */}
                    <div className="md:col-span-5">
                        <h1 className="text-lg font-semibold mb-4">Subscribe</h1>
                        <p className="text-sm text-gray-300 mb-4">
                            Subscribe to our newsletter to get offers, coupon codes and promotional advertisement.
                        </p>
                        <div className="flex gap-2 mb-6">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="flex-1 px-4 py-2.5 bg-transparent border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                            />
                            <PrimaryBtn
                                icon={MailCheckIcon}
                                title="Subscribe"
                                onClick={handleSubsClick}
                                ariaLabel={"Subscribe our product" + appName}
                            />
                        </div>

                        {/* Follow Us */}
                        <div>
                            <h2 className="text-base font-semibold mb-3">Follow Us</h2>
                            <div className="flex space-x-4">
                                <a href="#" className="text-white hover:text-blue-500 transition" aria-label="Facebook">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h1.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h1.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-white hover:text-blue-400 transition" aria-label="Twitter">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-white hover:text-blue-700 transition" aria-label="LinkedIn">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h1.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h1.555V9h1.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-white hover:text-pink-500 transition" aria-label="Pinterest">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="pt-8 border-t border-gray-800 flex justify-center">
                    <p className="text-sm text-gray-400">
                        © 2025 {appName} - All rights reserved.
                    </p>
                </div>
            </LayoutTemplate>
        </footer>
    );
}