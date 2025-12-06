"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    url: string;
}

export default function ShareButton({ url }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check out this product!",
                    url,
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                // User cancelled or error → fallback to copy
                await copyToClipboard();
            }
        } else {
            await copyToClipboard();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            className="cursor-pointer p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
            aria-label={copied ? "Link copied!" : "Share product link"}
        >
            <Share2 size={24} className="text-gray-600" />
        </button>
    );
}