import { categoryService } from '@/services/category_service';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { ComponentType } from 'react';
import SlideButtons from './slide_buttons'; // ← kita buat ini

export default async function Categories() {
    const categories = await categoryService.getCategories();

    if (!categories || categories.length === 0) {
        return null;
    }

    const getIconComponent = (iconName: string) => {
        const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
        const Icon = (LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>)[formattedName];
        return Icon || LucideIcons.Package;
    };

    return (
        <div className="w-full relative">
            <SlideButtons />

            <div
                id="categories-scroll-container"
                className="flex gap-4 py-2 overflow-x-auto scrollbar-hide whitespace-nowrap"
            >
                {categories.map((category) => {
                    const IconComponent = getIconComponent(category.icon);
                    return (
                        <Link
                            key={category.category_id}
                            href={`/categories/${category.category_slug}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-red-500 hover:shadow-md transition-all group min-w-max"
                        >
                            <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors flex-shrink-0" />
                            <span className="text-sm text-gray-700 group-hover:text-red-500 whitespace-nowrap">
                                {category.category_name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}