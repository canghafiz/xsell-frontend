'use client';

import * as LucideIcons from 'lucide-react';

export default function SlideButtons() {
    const scroll = (delta: number) => {
        const container = document.getElementById('categories-scroll-container');
        if (container) {
            container.scrollBy({ left: delta, behavior: 'smooth' });
        }
    };

    return (
        <>
            <button
                onClick={() => scroll(-250)}
                className="cursor-pointer hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md z-10 hover:bg-gray-50"
                aria-label="Scroll left"
            >
                <LucideIcons.ChevronLeft className="w-4 h-4 mx-auto text-gray-600" />
            </button>

            <button
                onClick={() => scroll(250)}
                className="cursor-pointer hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md z-10 hover:bg-gray-50"
                aria-label="Scroll right"
            >
                <LucideIcons.ChevronRight className="w-4 h-4 mx-auto text-gray-600" />
            </button>
        </>
    );
}