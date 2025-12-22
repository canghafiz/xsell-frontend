'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MyProductItem } from "@/types/product";
import { MoreVertical, Eye, Heart } from "lucide-react";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/currency";
import productService from "@/services/product_service";
import cookiesService from "@/services/cookies_service";

interface CardAdsProps {
    item: MyProductItem;
    onUpdate?: (item: MyProductItem) => void;
    onDelete?: (item: MyProductItem) => void;
    onStatusUpdated?: () => void; // optional: refetch parent
}

export default function CardAds({
                                    item,
                                    onUpdate,
                                    onDelete,
                                    onStatusUpdated,
                                }: CardAdsProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** ======================
     *  Update Status Handler
     *  ====================== */
    const handleUpdateStatus = async () => {
        if (loadingStatus) return;

        try {
            setLoadingStatus(true);

            const accessToken = cookiesService.getCookie("login_data");
            if (!accessToken) {
                throw new Error("Access token not found");
            }

            const nextStatus =
                item.status === "Sold out" ? "Available" : "Sold out";

            const res = await productService.updateStatus(
                item.product_id,
                nextStatus,
                accessToken
            );

            if (!res.success) {
                console.warn("Failed to update product status", res);
                return;
            }

            // Notify parent to refetch data
            onStatusUpdated?.();

        } catch (error) {
            console.error("Update product status error:", error);
        } finally {
            setLoadingStatus(false);
        }
    };

    return (
        <div className="relative bg-white border-2 border-red-800 rounded-2xl">
            {/* Header */}
            <div className="flex justify-between mb-3 bg-red-50 p-2 rounded-t-2xl items-center">
                <span className="text-xs font-medium text-red-600">
                    {formatDate(item.created_at)}
                </span>

                {/* Action menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(v => !v)}
                        className="cursor-pointer p-1 rounded-full hover:bg-red-100"
                        aria-label="Open menu"
                    >
                        <MoreVertical size={18} className="text-red-800" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-20">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    router.push(`/product/${item.slug}`);
                                }}
                                className="cursor-pointer w-full text-left px-4 py-2 text-sm rounded-t-lg hover:bg-red-100"
                            >
                                View
                            </button>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onUpdate?.(item);
                                }}
                                className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-red-100"
                            >
                                Update
                            </button>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onDelete?.(item);
                                }}
                                className="cursor-pointer w-full text-left px-4 py-2 text-sm rounded-b-lg text-red-600 hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-3 p-2">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${item.main_image}`}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="rounded-lg object-cover"
                        unoptimized
                    />
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1 line-clamp-2">
                        {item.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-red-500 mb-2">
                        <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {item.view_count}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart size={14} />
                            {item.total_like}
                        </span>
                    </div>

                    <p className="text-sm font-semibold text-red-800">
                        {formatCurrency(item.price)}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <button
                onClick={handleUpdateStatus}
                disabled={loadingStatus}
                className="
                    cursor-pointer m-4 px-8 py-2 text-sm font-medium
                    border-2 border-red-800 rounded-xl
                    text-red-800
                    hover:bg-red-100
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                {loadingStatus
                    ? "Updating..."
                    : item.status === "Sold out"
                        ? "Mark as Available"
                        : "Mark as Sold"}
            </button>
        </div>
    );
}
