'use client';

import LayoutTemplate from "@/components/layout";
import TopPost from "@/components/post/top_post";
import { useRouter } from "next/navigation";
import cookiesService from "@/services/cookies_service";
import Toast from "@/components/toast";
import React, { useState, useEffect } from "react";
import CategoryService from "@/services/category_service";
import * as LucideIcons from "lucide-react";
import { CategoryItem } from "@/types/category";
import { LucideIcon } from "lucide-react";

export default function CategoryPost() {
    const router = useRouter();
    const haveCategory = cookiesService.getCookie("post_category");

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    /**
     * Fetch categories & load selected category from cookie
     */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getCategories();
                if (data) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();

        if (haveCategory) {
            const parsedId = Number(haveCategory);
            if (!isNaN(parsedId)) {
                setSelectedCategory(parsedId);
            }
        }
    }, [haveCategory]);

    /**
     * Clear cookie AFTER page reload
     */
    useEffect(() => {
        const navigationEntries =
            performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];

        if (navigationEntries[0]?.type === "reload") {
            setSelectedCategory(null);
            cookiesService.clearCookie("post_category");
        }
    }, []);

    /**
     * Show browser confirmation dialog when reloading
     */
    useEffect(() => {
        if (!haveCategory) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [haveCategory]);

    const getIconComponent = (iconName: string): LucideIcon => {
        const capitalizedIconName =
            iconName.charAt(0).toUpperCase() + iconName.slice(1);

        const icons = LucideIcons as unknown as Record<string, LucideIcon>;
        return icons[capitalizedIconName] || LucideIcons.Package;
    };

    const handleCategorySelect = (category: CategoryItem) => {
        cookiesService.setCookie(
            "post_category",
            String(category.category_id)
        );
        setSelectedCategory(category.category_id);
    };

    const onClickNext = () => {
        if (selectedCategory) {
            router.push("/post/attributes");
            return;
        }

        setToast({
            type: "error",
            message: "Category is required",
        });
    };

    return (
        <LayoutTemplate>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <TopPost onCLickNext={onClickNext} />

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    Select Category
                </h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">
                        Loading categories...
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category) => {
                            const IconComponent = getIconComponent(category.icon);
                            const isSelected =
                                selectedCategory === category.category_id;

                            return (
                                <button
                                    key={category.category_id}
                                    onClick={() =>
                                        handleCategorySelect(category)
                                    }
                                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all duration-200 ${
                                        isSelected
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                                    }`}
                                >
                                    <IconComponent
                                        className={`w-12 h-12 mb-3 ${
                                            isSelected
                                                ? "text-red-600"
                                                : "text-gray-600"
                                        }`}
                                        strokeWidth={1.5}
                                    />

                                    <span
                                        className={`text-sm font-medium text-center ${
                                            isSelected
                                                ? "text-red-600"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {category.category_name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </LayoutTemplate>
    );
}
