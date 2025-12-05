import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

export default function LayoutTemplate({ children }: LayoutProps) {
    return (
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
            {children}
        </div>
    )
}