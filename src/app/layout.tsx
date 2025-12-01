import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const interSans = Inter({
    variable: "--font-inter-sans",
    subsets: ["latin"],
});

const interMono = Inter({
    variable: "--font-inter-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light">
        <body
            className={`${interSans.variable} ${interMono.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
