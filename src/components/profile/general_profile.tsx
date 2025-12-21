'use client';

import React, { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import { User } from "@/types/user";
import { Share2, Edit, Eye, Heart, Calendar } from "lucide-react";
import Image from "next/image";
import { productService } from "@/services/product_service";
import { cookiesService } from "@/services/cookies_service";
import { MyProductItem } from "@/types/product";
import Link from "next/link";
import {formatCurrency} from "@/utils/currency";

const buttonVariants = cva(
    "cursor-pointer font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
                secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
                outline: "border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500",
                ghost: "text-red-600 hover:bg-red-50 focus:ring-red-500",
                danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
            },
            size: {
                sm: "px-6 py-1.5 text-xs rounded",
                md: "px-10 py-2 rounded-lg",
                lg: "px-14 py-3 text-base rounded-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface GeneralProfileProps {
    user: User;
    isOwnProfile?: boolean;
}

export default function GeneralProfile({ user, isOwnProfile = false }: GeneralProfileProps) {
    const [products, setProducts] = useState<MyProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const loginData = cookiesService.getCookie('login_data');
                if (!loginData) {
                    throw new Error("Access token not found");
                }

                const res = await productService.getMyProducts(
                    user.user_id,
                    'new_to_oldest',
                    loginData
                );

                if (res.success && res.data) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [user.user_id]);

    const handleEditProfile = () => {
        console.log("Edit profile clicked");
    };

    const handleShareProfile = () => {
        const profileUrl = `${window.location.origin}/profile/${user.user_id}`;

        if (navigator.share) {
            navigator.share({
                title: `${user.first_name}'s Profile`,
                text: `Check out ${user.first_name}'s profile`,
                url: profileUrl,
            }).catch((error) => {
                console.log('Error sharing:', error);
            });
        } else {
            navigator.clipboard.writeText(profileUrl).then(() => {
                alert('Profile link copied to clipboard!');
            }).catch((error) => {
                console.error('Failed to copy:', error);
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatMemberSince = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
        });
    };

    return (
        <div>
            {/* Top */}
            <div className="w-full bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left side - Profile info */}
                    <div className="flex items-center gap-4">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-red-400">
                                {user.photo_profile ? (
                                    <Image
                                        src={user.photo_profile}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                                        {user.first_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name and Member Since */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.first_name} {user.last_name}
                            </h1>
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Member since {formatMemberSince(user.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Action buttons */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        {isOwnProfile && (
                            <button
                                type="button"
                                onClick={handleEditProfile}
                                className={buttonVariants({
                                    variant: "outline",
                                    size: "md",
                                })}
                            >
                                <Edit className="w-4 h-4" />
                                Edit profile
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleShareProfile}
                            className={buttonVariants({
                                variant: "primary",
                                size: "md",
                            })}
                        >
                            <Share2 className="w-4 h-4" />
                            Share profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Ads Section */}
            <div className="mt-6 w-full bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ads ({products.length})</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No ads found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <Link
                                key={product.product_id}
                                href={`/product/${product.slug}`}
                                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                    <Image src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${product.main_image}`}
                                           alt={product.title}
                                           fill
                                           unoptimized
                                           className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                product.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                        {product.status}
                            </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {product.title}
                                    </h3>

                                    <p className="text-lg font-bold text-red-600 mb-3">
                                        {formatCurrency(product.price)}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{product.view_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                <span>{product.total_like}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-xs text-gray-600">
                                        {formatDate(product.created_at)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}