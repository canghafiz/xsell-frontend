'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import { BannerItem } from "@/types/banner";

interface BannersClientProps {
    initialBanners: BannerItem[];
    imagePrefixUrl: string;
}

export default function BannersClient({ initialBanners, imagePrefixUrl }: BannersClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const banners = initialBanners;

    const nextSlide = useCallback(() => {
        if (banners.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }
    }, [banners.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto slide every 5 seconds
    useEffect(() => {
        if (!isHovered && banners.length > 1) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [isHovered, nextSlide, banners.length]);

    if (!banners || banners.length === 0) {
        return null;
    }

    const getVisibleBanners = () => {
        const visible = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % banners.length;
            visible.push({ ...banners[index], position: i });
        }
        return visible;
    };

    const visibleBanners = getVisibleBanners();

    return (
        <div
            className="relative w-full bg-gradient-to-b from-gray-50 to-white py-8 px-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Banner Container */}
            <div className="relative mx-auto overflow-hidden py-2">
                <div className="flex items-center justify-center gap-3 md:gap-4 h-full">
                    {visibleBanners.map((banner, idx) => {
                        const isActive = idx === 0;
                        const isNext = idx === 1;

                        return (
                            <div
                                key={`${banner.banner_id}-${idx}`}
                                className={`
                                    relative transition-all duration-700 ease-out
                                    ${isActive
                                    ? 'w-full md:w-[55%] z-10'
                                    : isNext
                                        ? 'hidden md:block md:w-[55%] z-5'
                                        : 'hidden md:block md:w-[55%] z-0'
                                }
                                `}
                                style={{ aspectRatio: '16/9' }}
                                onClick={() => !isActive && goToSlide((currentIndex + idx) % banners.length)}
                            >
                                <a
                                    href={banner.link}
                                    className={`block h-full ${!isActive && 'cursor-pointer'}`}
                                    onClick={(e) => !isActive && e.preventDefault()}
                                >
                                    <div className="relative h-full rounded-xl md:rounded-2xl overflow-hidden duration-300 group">
                                        <Image
                                            src={imagePrefixUrl + banner.image_url}
                                            alt={banner.title || 'Banner'}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                            priority={idx === 0}
                                            loading={idx === 0 ? 'eager' : 'lazy'}
                                            sizes="(max-width: 768px) 100vw, 55vw"
                                        />

                                        {/* Overlay gradient for inactive banners */}
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                                        )}
                                    </div>
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-3 mt-6">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`
        rounded-full transition-all duration-300
        ${index === currentIndex
                            ? 'w-8 h-2 bg-red-600'
                            : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                        }
      `}
                        aria-label={`Go to banner ${index + 1}`}
                        style={{ padding: '6px' }}
                    />
                ))}
            </div>
        </div>
    );
}