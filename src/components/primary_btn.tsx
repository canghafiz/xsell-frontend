import React from "react";

interface PrimaryBtnProps {
    icon: React.ElementType;
    title: string;
    onClick?: () => void;
}

export default function PrimaryBtn({ icon: Icon, title, onClick }: PrimaryBtnProps) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors"
        >
            <Icon className="h-5 w-5" />
            <span className="hidden sm:inline">{title}</span>
        </button>
    );
}