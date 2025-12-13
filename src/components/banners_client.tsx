'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const nextSlide = useCallback(() => {
        if (banners.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }
    }, [banners.length]);

    const prevSlide = useCallback(() => {
        if (banners.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
        }
    }, [banners.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

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

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    return (
        //  container full-width
        <div
            className="relative w-full bg-gradient-to-b from-gray-50 to-white py-8 px-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
        >
            <div className="relative mx-auto overflow-hidden py-2">
                <div className="flex items-center justify-center gap-3 md:gap-4 h-full min-h-[200px]">
                    {visibleBanners.map((banner, idx) => {
                        const isActive = idx === 0;
                        const isNext = idx === 1;
                        return (
                            <div
                                key={`${banner.banner_id}-${idx}`}
                                className={`relative transition-all duration-700 ease-out ${
                                    isActive
                                        ? 'w-full md:w-[55%] z-10'
                                        : isNext
                                            ? 'hidden md:block md:w-[55%] z-5'
                                            : 'hidden md:block md:w-[55%] z-0'
                                }`}
                                style={{ aspectRatio: '16/9', minHeight: '200px' }}
                            >
                                <a
                                    href={banner.link}
                                    rel="noopener noreferrer"
                                    className="block h-full"
                                >
                                    <div className="relative h-full rounded-xl md:rounded-2xl overflow-hidden duration-300 group">
                                        <Image
                                            src={imagePrefixUrl + banner.image_url}
                                            alt={banner.title || 'Banner'}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                            priority={isActive}
                                            loading={isActive ? 'eager' : 'lazy'}
                                            sizes="(max-width: 768px) 100vw, (min-width: 768px) 55vw"
                                        />
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

            <div className="flex justify-center gap-3 mt-6">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'w-8 h-2 bg-red-600'
                                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to banner ${index + 1}`}
                        style={{ padding: '6px' }}
                    />
                ))}
            </div>
        </div>
    );
}