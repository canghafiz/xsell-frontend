'use client';

import LayoutTemplate from "@/components/layout";
import Image from "next/image";
import Link from "next/link";
import { MailCheckIcon, Facebook, Instagram, Linkedin } from "lucide-react";
import PrimaryBtn from "@/components/primary_btn";

export default function Footer() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";

    const handleSubsClick = () => {
        console.log("Subscribe button clicked!");
    };

    return (
        <footer className="bg-black text-white py-12">
            <LayoutTemplate>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    {/* Left Column - Brand */}
                    <div className="md:col-span-5">
                        <Image
                            src="/brand.png"
                            alt={`${appName} Logo`}
                            width={0}
                            height={0}
                            priority
                            sizes="100vw"
                            style={{ width: 'auto', height: '2.5rem' }}
                        />
                        <p className="text-sm text-gray-300 leading-relaxed mt-4">
                            Discover, trade, and trust. From smartphones to scooters, list or find pre-loved items in minutes. Every deal is protected, every user verified. Buy smarter, sell faster — all in a marketplace built on real trust.
                        </p>
                    </div>

                    {/* Middle Column - Quick Links */}
                    <div className="md:col-span-2">
                        <h1 className="text-base font-semibold mb-4">Quick Links</h1>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-use" className="hover:text-white transition">Terms Of Use</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Right Column - Subscribe */}
                    <div className="md:col-span-5">
                        <h1 className="text-lg font-semibold mb-4">Subscribe</h1>
                        <p className="text-sm text-gray-300 mb-4">
                            Subscribe to our newsletter to receive offers, coupon codes, and promotional updates.
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
                                ariaLabel={`Subscribe to ${appName}`}
                            />
                        </div>

                        {/* Social Media */}
                        <div>
                            <h2 className="text-base font-semibold mb-3">Follow Us</h2>
                            <div className="flex space-x-4">
                                <Link href={`${process.env.NEXT_PUBLIC_FACEBOOK || "facebook.com"}`} aria-label="Facebook" className="text-white hover:text-blue-500 transition transform hover:scale-110">
                                    <Facebook size={24} />
                                </Link>
                                <Link href={`${process.env.NEXT_PUBLIC_INSTAGRAM || "instagram.com"}`} aria-label="Instagram" className="text-white hover:text-pink-500 transition transform hover:scale-110">
                                    <Instagram size={24} />
                                </Link>
                                <Link href={`${process.env.NEXT_PUBLIC_LINKEDIN || "linkedin.com"}`} aria-label="LinkedIn" className="text-white hover:text-blue-700 transition transform hover:scale-110">
                                    <Linkedin size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-800 flex justify-center">
                    <p className="text-sm text-gray-400">
                        © 2026 {appName} - All rights reserved.
                    </p>
                </div>
            </LayoutTemplate>
        </footer>
    );
}
