'use client';

import LayoutTemplate from '@/components/layout';
import TopPost from '@/components/post/top_post';
import { useRouter } from 'next/navigation';
import cookiesService from '@/services/cookies_service';
import Toast from '@/components/toast';
import React, { useState, useEffect, useRef } from 'react';
import CategoryService from '@/services/category_service';
import * as LucideIcons from 'lucide-react';
import { CategoryItem } from '@/types/category';
import { LucideIcon } from 'lucide-react';
import {usePostStore} from "@/stores/post_store";

// Define the shape of the selected category
interface SelectedCategory {
    id: number;
    slug: string;
}

export default function CategoryPost() {
    const router = useRouter();
    const hasCheckedReload = useRef(false);

    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
    const { setCategory } = usePostStore();

    /**
     * Restore category from cookie
     */
    const restoreCategoryFromCookie = () => {
        const savedCookie = cookiesService.getCookie('post_category');
        if (savedCookie) {
            const parsed = JSON.parse(savedCookie) as SelectedCategory;
            setSelectedCategory(parsed);
        }
    };

    useEffect(() => {
        if (hasCheckedReload.current) return;
        hasCheckedReload.current = true;

        const haveCategory = cookiesService.getCookie('post_category');

        if (haveCategory) {
            restoreCategoryFromCookie();
        }

        sessionStorage.removeItem('just_navigated_to_category');
    }, []);

    /**
     * Restore from cookie when page becomes visible again (back navigation)
     */
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                restoreCategoryFromCookie();
            }
        };

        const handleFocus = () => {
            restoreCategoryFromCookie();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    /**
     * Handle popstate (browser back/forward) - restore cookie immediately
     */
    useEffect(() => {
        const handlePopState = () => {
            sessionStorage.setItem('just_navigated_to_category', 'true');
            setTimeout(() => {
                restoreCategoryFromCookie();
            }, 50);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    /**
     * Fetch categories from API.
     */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setToast({
                    type: 'error',
                    message: 'Failed to load categories. Please try again.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    /**
     * Show browser confirmation dialog if a category is selected
     * and the user tries to leave or reload.
     */
    useEffect(() => {
        if (selectedCategory === null) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            cookiesService.clearCookie('post_category')
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [selectedCategory]);

    /**
     * Resolve Lucide icon dynamically by name.
     */
    const getIconComponent = (iconName: string): LucideIcon => {
        const capitalizedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
        const icons = LucideIcons as unknown as Record<string, LucideIcon>;
        return icons[capitalizedIconName] || LucideIcons.Package;
    };

    /**
     * Handle category selection: store {id, slug} in cookie and state.
     */
    const handleCategorySelect = (category: CategoryItem) => {
        const selection: SelectedCategory = {
            id: category.category_id,
            slug: category.category_slug,
        };

        cookiesService.setCookie('post_category', JSON.stringify(selection));
        setSelectedCategory(selection);
    };

    /**
     * Proceed to next step if a category is selected.
     */
    const onClickNext = () => {
        if (selectedCategory !== null) {
            cookiesService.setCookie('post_category', JSON.stringify(selectedCategory));
            setCategory(selectedCategory.slug)
            router.push('/post/attributes');
            return;
        }

        setToast({
            type: 'error',
            message: 'Please select a category to continue.',
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
                <h2 className="text-xl font-semibold mb-4">Select Category</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading categories...</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category) => {
                            const IconComponent = getIconComponent(category.icon);
                            const isSelected = selectedCategory?.id === category.category_id;

                            return (
                                <button
                                    key={category.category_id}
                                    onClick={() => handleCategorySelect(category)}
                                    className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all duration-200 ${
                                        isSelected
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-red-500 hover:bg-red-50'
                                    }`}
                                >
                                    <IconComponent
                                        className={`w-12 h-12 mb-3 ${
                                            isSelected ? 'text-red-600' : 'text-gray-600'
                                        }`}
                                        strokeWidth={1.5}
                                    />
                                    <span
                                        className={`text-sm font-medium text-center ${
                                            isSelected ? 'text-red-600' : 'text-gray-700'
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