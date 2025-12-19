'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SubCategoryItem } from '@/types/sub_category';
import { ProductSpecItem } from '@/types/product_spec';
import subCategoryService from '@/services/sub_category_service';
import cookiesService from '@/services/cookies_service';
import productSpecService from '@/services/product_spec_service';
import PostLocation from "@/components/post/post_location";
import {usePostStore} from "@/stores/post_store";

export default function PostListingForm() {
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
    const [productSpecs, setProductSpecs] = useState<ProductSpecItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSpecs, setLoadingSpecs] = useState(false);
    const { category } = usePostStore();

    const [formData, setFormData] = useState({
        subCategoryId: '',
        condition: '',
        title: '',
        price: '',
        description: '',
        status: '',
        location: '',
    });

    const conditions = ['New', 'Like New', 'Good', 'Good Quite', 'Needs Repair'];
    const statuses = ['Available', 'Sold out'];

    const imageSliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (category === '') {
            cookiesService.clearCookie('post_category');
            window.history.back()
            return
        }

        loadSubCategories();
    }, [category]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const loadSubCategories = async () => {
        try {
            const cookieValue = cookiesService.getCookie('post_category');
            if (!cookieValue) {
                console.error('post_category cookie not found');
                return;
            }

            const categoryData = JSON.parse(cookieValue);
            const slug = categoryData.slug;
            const response = await subCategoryService.getByCategorySlug(slug);

            if (response.success && Array.isArray(response.data)) {
                setSubCategories(response.data);
            }
        } catch (error) {
            console.error('Error loading subcategories:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProductSpecs = async (subId: number) => {
        setLoadingSpecs(true);
        try {
            const response = await productSpecService.getBySubId(subId);
            if (response.success && Array.isArray(response.data)) {
                setProductSpecs(response.data);
            } else {
                setProductSpecs([]);
            }
        } catch (error) {
            console.error('Error loading product specs:', error);
            setProductSpecs([]);
        } finally {
            setLoadingSpecs(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...images];
            const newPreviews = [...imagePreviews];
            newImages[index] = file;
            newPreviews[index] = URL.createObjectURL(file);
            setImages(newImages);
            setImagePreviews(newPreviews);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'subCategoryId' && value) {
            loadProductSpecs(Number(value));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Upload Photos Section */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Upload Ad Photos</h2>
                    <p className="text-sm text-gray-500">Your photos will be converted to samples/thumbnails</p>
                </div>

                <div
                    ref={imageSliderRef}
                    className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar -mx-1 px-1"
                >
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="flex-shrink-0 w-24">
                            <div className="relative w-full pb-[100%]">
                                <label className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors flex flex-col items-center justify-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, index)}
                                    />
                                    {imagePreviews[index] ? (
                                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={imagePreviews[index]}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    )}
                                </label>
                            </div>
                            <p className="text-center text-xs text-gray-600 mt-1 whitespace-nowrap">
                                {index === 0 ? 'Cover' : `Photo ${index + 1}`}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="text-red-600 text-sm mt-2">Required</p>

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>

            {/* Item Details Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Item Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="text-red-600">*</span>
                        </label>
                        <select
                            name="subCategoryId"
                            value={formData.subCategoryId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
                        >
                            <option value="">-- Select --</option>
                            {subCategories.map((subCat) => (
                                <option key={subCat.sub_category_id} value={subCat.sub_category_id}>
                                    {subCat.sub_category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condition <span className="text-red-600">*</span>
                        </label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">-- Select --</option>
                            {conditions.map((condition) => (
                                <option key={condition} value={condition}>
                                    {condition}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ✅ Product Specifications — Single Grid (No Grouping) */}
                {loadingSpecs ? (
                    <div className="text-center py-4">
                        <p className="text-gray-500">Loading specifications...</p>
                    </div>
                ) : productSpecs.length > 0 ? (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {productSpecs.map((spec) => (
                                <div key={spec.id}>
                                    <label htmlFor={`spec_${spec.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        {spec.name}
                                    </label>
                                    <input
                                        type="text"
                                        id={`spec_${spec.id}`}
                                        name={`spec_${spec.id}`}
                                        placeholder={`Enter ${spec.name.toLowerCase()}`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Title and Description */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Please Provide Title and Description
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Title <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
                        maxLength={70}
                    />
                    <p className="text-right text-sm text-gray-500 mt-1">{formData.title.length} / 70</p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                        placeholder="Include condition, features, and reason for selling"
                        maxLength={4096}
                    />
                    <p className="text-right text-sm text-gray-500 mt-1">{formData.description.length} / 4096</p>
                </div>
            </div>

            {/* Price & Status — Grid Layout */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (Rp) <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter price"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status <span className="text-red-600">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">-- Select --</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Location Details</h2>
                <PostLocation/>
            </div>
        </div>
    );
}