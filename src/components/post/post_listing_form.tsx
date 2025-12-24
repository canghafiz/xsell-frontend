'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SubCategoryItem } from '@/types/sub_category';
import { ProductSpecItem } from '@/types/product_spec';
import subCategoryService from '@/services/sub_category_service';
import cookiesService from '@/services/cookies_service';
import productSpecService from '@/services/product_spec_service';
import storageService from '@/services/storage_service';
import PostLocation from "@/components/post/post_location";
import { usePostStore } from "@/stores/post_store";
import { getCurrencySymbol } from "@/helpers/currency";
import { User } from "@/types/user";
import { ProductListingPayload } from "@/types/post";
import postService from "@/services/post_service";
import { useRouter } from "next/navigation";
import Toast from "@/components/toast";

/**
 * Type used to track image source
 */
type ImageSource = {
    type: 'file' | 'url';
    data: File | string;
    preview: string;
    imageId?: number; // Used to track existing image ID
};

const getCurrencyLocale = (currency: string): string => {
    const localeMap: { [key: string]: string } = {
        IDR: 'id-ID',
        USD: 'en-US',
        EUR: 'de-DE',
        GBP: 'en-GB',
        SGD: 'en-SG',
        MYR: 'ms-MY',
        THB: 'th-TH',
        PHP: 'en-PH',
        VND: 'vi-VN',
        JPY: 'ja-JP',
        CNY: 'zh-CN',
        KRW: 'ko-KR',
        INR: 'en-IN',
        AUD: 'en-AU',
    };

    return localeMap[currency] || 'en-US';
};

const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') return '';

    const currency = process.env.NEXT_PUBLIC_CURRENCY || 'IDR';
    const locale = getCurrencyLocale(currency);

    return new Intl.NumberFormat(locale).format(parseInt(numericValue));
};

const parsePrice = (formattedValue: string): string => {
    return formattedValue.replace(/\D/g, '');
};

export default function PostListingForm() {
    const [images, setImages] = useState<(ImageSource | null)[]>(Array(10).fill(null));
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // Track image URLs to be deleted
    const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
    const [productSpecs, setProductSpecs] = useState<ProductSpecItem[]>([]);
    const [specs, setSpecs] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [loadingSpecs, setLoadingSpecs] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const router = useRouter();
    const { category, location, product, clearProduct } = usePostStore();

    const [mode, setMode] = useState<'create' | 'update'>('create');
    const [listingId, setListingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        subCategoryId: '',
        condition: '',
        title: '',
        price: '',
        description: '',
        status: '',
    });

    const conditions = ['New', 'Like New', 'Good', 'Good Quite', 'Needs Repair'];
    const statuses = ['Available', 'Sold Out'];

    const imageSliderRef = useRef<HTMLDivElement>(null);
    const [displayPrice, setDisplayPrice] = useState('');

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    /**
     * Load existing product data when in update mode
     */
    useEffect(() => {
        if (product) {
            setMode('update');
            setListingId(product.product_id);
            loadExistingProduct();
        }
    }, [product]);

    useEffect(() => {
        if (category === '') {
            cookiesService.clearCookie('post_category');
            window.history.back();
            return;
        }

        loadSubCategories();
    }, [category]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const { user } = await res.json();
                setUser(user);
            } catch (e) {
                console.warn('Failed to fetch user', e);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (formData.price) {
            setDisplayPrice(formatPrice(formData.price));
        }
    }, [formData.price]);

    /**
     * Populate specifications when product specs are loaded (update mode only)
     */
    useEffect(() => {
        if (product && productSpecs.length > 0 && mode === 'update') {
            const specsObj: { [key: string]: string } = {};
            product.specs.forEach(productSpec => {
                const matchingSpec = productSpecs.find(ps => ps.name === productSpec.name);
                if (matchingSpec) {
                    specsObj[matchingSpec.id] = productSpec.value;
                }
            });
            setSpecs(specsObj);
        }
    }, [productSpecs, product, mode]);

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
            setProductSpecs(
                response.success && Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error('Error loading product specifications:', error);
            setProductSpecs([]);
        } finally {
            setLoadingSpecs(false);
        }
    };

    /**
     * Load existing product data for update mode
     */
    const loadExistingProduct = async () => {
        if (!product) return;

        try {
            setFormData({
                title: product.title,
                description: product.description,
                price: product.price.toString(),
                condition: product.condition,
                status: product.status,
                subCategoryId: product.sub_category.sub_category_id.toString(),
            });

            await loadProductSpecs(product.sub_category.sub_category_id);

            const loadedImages: (ImageSource | null)[] = Array(10).fill(null);
            product.images
                .sort((a, b) => a.order_seq - b.order_seq)
                .forEach((img, idx) => {
                    loadedImages[idx] = {
                        type: 'url',
                        data: img.url,
                        preview: `${process.env.NEXT_PUBLIC_STORAGE_URL}${img.url}`,
                        imageId: img.image_id,
                    };
                });

            setImages(loadedImages);
        } catch (error) {
            console.error('Error loading product:', error);
        }
    };

    /**
     * Handle image selection
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newImages = [...images];

        if (newImages[index]?.type === 'url') {
            setImagesToDelete(prev => [...prev, newImages[index]!.data as string]);
        }

        newImages[index] = {
            type: 'file',
            data: file,
            preview: URL.createObjectURL(file),
        };

        setImages(newImages);
    };

    /**
     * Remove image from slot
     */
    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        const currentImage = newImages[index];

        if (currentImage) {
            if (currentImage.type === 'url') {
                setImagesToDelete(prev => [...prev, currentImage.data as string]);
            } else {
                URL.revokeObjectURL(currentImage.preview);
            }
        }

        newImages[index] = null;
        setImages(newImages);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'subCategoryId' && value) {
            loadProductSpecs(Number(value));
        }
    };

    const handleSpecChange = (specId: number, value: string) => {
        setSpecs(prev => ({ ...prev, [specId]: value }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = parsePrice(e.target.value);
        setFormData(prev => ({ ...prev, price: numericValue }));
        setDisplayPrice(formatPrice(e.target.value));
    };

    /**
     * Main submit handler
     */
    const handleSubmit = async () => {
        if (!user) {
            alert('Please login first');
            return;
        }

        if (!location?.latitude || !location?.longitude || !location.address) {
            alert('Please select a location');
            return;
        }

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.price ||
            !formData.condition ||
            !formData.status ||
            !formData.subCategoryId
        ) {
            alert('Please fill all required fields');
            return;
        }

        const validImages = images.filter(Boolean);
        if (validImages.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        setUploading(true);

        try {
            const token = cookiesService.getCookie('login_data');
            if (!token) return;

            const newFiles: File[] = [];
            const existingUrls: { [index: number]: string } = {};

            images.forEach((img, index) => {
                if (!img) return;
                if (img.type === 'file') newFiles.push(img.data as File);
                else existingUrls[index] = img.data as string;
            });

            let uploadedUrls: string[] = [];
            const finalImages = { ...existingUrls };

            if (newFiles.length > 0) {
                const uploadResult = await storageService.uploadFiles(newFiles);
                if (!uploadResult.success || !uploadResult.data) return;

                uploadedUrls = uploadResult.data.map(i => i.file_url);

                let uploadIdx = 0;
                images.forEach((img, index) => {
                    if (img?.type === 'file') {
                        finalImages[index] = uploadedUrls[uploadIdx++];
                    }
                });
            }

            const payload: ProductListingPayload = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                condition: formData.condition,
                status: formData.status,
                sub_category_id: parseInt(formData.subCategoryId),
                listing_user_id: user.user_id,
                images: Object.entries(finalImages)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([_, url], idx) => ({
                        image_url: url,
                        is_primary: idx === 0,
                        order_sequence: idx + 1,
                    })),
                specs: Object.entries(specs)
                    .filter(([_, v]) => v.trim() !== '')
                    .map(([id, v]) => ({
                        category_product_spec_id: Number(id),
                        spec_value: v,
                    })),
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: location.address,
                },
            };

            const result =
                mode === 'create'
                    ? await postService.createPost(token, payload)
                    : await postService.updatePost(token, listingId!, payload);

            if (result.success) {
                if (mode === 'update' && imagesToDelete.length > 0) {
                    await storageService.deleteFiles(imagesToDelete);
                    setImagesToDelete([]);
                }

                setToast({
                    type: 'success',
                    message: mode === 'create'
                        ? 'Ad posted successfully!'
                        : 'Ad updated successfully!',
                });

                if (mode === 'update') clearProduct();

                setTimeout(() => router.push('/my-ads'), 1000);
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Mode Indicator */}
            {mode === 'update' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Update Mode:</strong> You are editing an existing ad
                    </p>
                </div>
            )}

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
                    {images.map((img, index) => (
                        <div key={index} className="flex-shrink-0 w-24">
                            <div className="relative w-full pb-[100%]">
                                <label className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors flex flex-col items-center justify-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, index)}
                                        disabled={uploading}
                                    />
                                    {img ? (
                                        <>
                                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveImage(index);
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                                            >
                                                ×
                                            </button>
                                            {img.type === 'url' && (
                                                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                                    Saved
                                                </div>
                                            )}
                                        </>
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
                                        value={specs[spec.id] || ''}
                                        onChange={(e) => handleSpecChange(spec.id, e.target.value)}
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

            {/* Price & Status */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price ({getCurrencySymbol()}) <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={displayPrice}
                            onChange={handlePriceChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter price"
                            inputMode="numeric"
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

            {/* Submit Button */}
            <div className="mb-8">
                <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className={`cursor-pointer w-full py-3 rounded-lg font-semibold transition-colors ${
                        uploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    {uploading ? 'Processing...' : mode === 'create' ? 'Post Ad' : 'Update Ad'}
                </button>
            </div>
        </div>
    );
}