"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ProductDetailItem, ProductDetailApiResponse } from "@/types/product";
import { productService } from "@/services/product_service";
import { Loader, AlertCircle, MapPin, User, X, ChevronLeft, ChevronRight } from "lucide-react";
import LayoutTemplate from "@/components/layout";
import { useProductSEO } from "@/hooks/userProductSEO";
import Head from "next/head";
import WishlistBtn from "@/components/wishlist_btn";
import ShareButton from "@/components/share_btn";

export default function ProductDetail() {
    const params = useParams();
    const slugParam = params?.slug;

    const [product, setProduct] = useState<ProductDetailItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<"description" | "specification">("description");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

    // ✅ Keyboard listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isGalleryOpen || !product) return;

            if (e.key === "Escape") {
                setIsGalleryOpen(false);
            } else if (e.key === "ArrowLeft") {
                setCurrentGalleryIndex((prev) =>
                    prev > 0 ? prev - 1 : product.images.length - 1
                );
            } else if (e.key === "ArrowRight") {
                setCurrentGalleryIndex((prev) =>
                    prev < product.images.length - 1 ? prev + 1 : 0
                );
            }
        };

        if (isGalleryOpen) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [isGalleryOpen, product]);

    // Update SEO when product is loaded
    useProductSEO(product, slugParam as string, mainImageIndex);

    useEffect(() => {
        if (slugParam === undefined) return;

        let slug: string | null = null;
        if (typeof slugParam === "string") {
            slug = slugParam.trim();
        } else if (Array.isArray(slugParam) && slugParam.length > 0) {
            slug = slugParam[0].trim();
        }

        if (!slug) {
            setError("Invalid product URL");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const res: ProductDetailApiResponse = await productService.getDetailBySlug(slug!);
                if (res.success && res.data) {
                    setProduct(res.data);
                    setMainImageIndex(0);
                } else {
                    setError(res.error || "Product not found");
                }
            } catch (err) {
                setError("Failed to load product");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slugParam]);

    if (slugParam === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-gray-500" />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="h-80 bg-gray-200 rounded-lg"></div>
                            <div className="flex gap-1.5 overflow-x-auto pb-1.5">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-12 w-12 bg-gray-200 rounded shrink-0"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-6 bg-red-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                            <div className="pt-3 space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-lg mx-auto px-4 py-10 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <h2 className="text-base font-semibold text-gray-800 mt-3">
                    {error || "Product not found"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Please check the URL or try again later.
                </p>
            </div>
        );
    }

    const primaryImage = product.images.find((img) => img.is_primary);
    const mainImage = product.images[mainImageIndex] || primaryImage || product.images[0];
    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${Array.isArray(slugParam) ? slugParam[0] : slugParam}`;

    const getImageUrl = (url: string) => {
        if (url.startsWith("http")) return url;
        return `${process.env.NEXT_PUBLIC_STORAGE_URL}${url}`;
    };

    const groupedSpecs: { [key: string]: typeof product.specs } = {};
    product.specs.forEach((spec) => {
        const group = spec.spec_type_title;
        if (!groupedSpecs[group]) {
            groupedSpecs[group] = [];
        }
        groupedSpecs[group].push(spec);
    });

    const openGallery = (index: number) => {
        setCurrentGalleryIndex(index);
        setIsGalleryOpen(true);
    };

    const goToPrev = () => {
        setCurrentGalleryIndex((prev) =>
            prev > 0 ? prev - 1 : product.images.length - 1
        );
    };

    const goToNext = () => {
        setCurrentGalleryIndex((prev) =>
            prev < product.images.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <>
            {product && (
                <Head>
                    <title>{`${product.title} - Rp${product.price.toLocaleString("id-ID")} | ${product.category.category_name}`}</title>
                    <meta name="title" content={`${product.title} - Rp${product.price.toLocaleString("id-ID")}`} />
                    <meta name="description" content={product.description.substring(0, 160)} />
                    <meta name="keywords" content={`${product.title}, ${product.category.category_name}, ${product.condition}, ${product.specs.map(s => s.value).join(", ")}`} />
                    <meta name="author" content={`${product.listing.first_name} ${product.listing.last_name || ""}`} />
                    <link rel="canonical" href={productUrl} />

                    <meta property="og:type" content="product" />
                    <meta property="og:url" content={productUrl} />
                    <meta property="og:title" content={`${product.title} - Rp${product.price.toLocaleString("id-ID")}`} />
                    <meta property="og:description" content={product.description.substring(0, 160)} />
                    <meta property="og:image" content={mainImage ? getImageUrl(mainImage.url) : "/placeholder-image.png"} />
                    <meta property="og:site_name" content="Your Site Name" />
                    <meta property="product:price:amount" content={product.price.toString()} />
                    <meta property="product:price:currency" content="IDR" />
                    <meta property="product:condition" content={product.condition.toLowerCase()} />
                    <meta property="product:availability" content={product.status === "Available" ? "in stock" : "out of stock"} />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content={productUrl} />
                    <meta name="twitter:title" content={`${product.title} - Rp${product.price.toLocaleString("id-ID")}`} />
                    <meta name="twitter:description" content={product.description.substring(0, 160)} />
                    <meta name="twitter:image" content={mainImage ? getImageUrl(mainImage.url) : "/placeholder-image.png"} />

                    <meta name="robots" content="index, follow" />
                    <meta name="language" content="Indonesian" />
                    <meta name="revisit-after" content="7 days" />
                </Head>
            )}
            <LayoutTemplate>
                <div className="flex gap-2 justify-end mb-2">
                    <WishlistBtn productId={product.product_id} />
                    <ShareButton url={productUrl} />
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden my-2">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    {product.category.category_name}
                                </span>
                                <h1 className="text-lg md:text-xl font-bold text-gray-900 mt-1.5">
                                    {product.title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-right">
                                    <p className="text-lg md:text-xl font-extrabold text-red-600">
                                        Rp{product.price.toLocaleString("id-ID")}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">Price</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:flex">
                        {/* Gambar */}
                        <div className="md:w-1/2 p-4 border-r border-gray-100">
                            {mainImage ? (
                                <div
                                    className="bg-gray-50 rounded-lg overflow-hidden relative h-80 cursor-pointer"
                                    onClick={() => openGallery(mainImageIndex)}
                                >
                                    <Image
                                        src={getImageUrl(mainImage.url)}
                                        alt={product.title}
                                        fill
                                        className="object-contain"
                                        onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">No image available</span>
                                </div>
                            )}

                            {product.images.length > 1 && (
                                <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1.5">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={img.image_id}
                                            onClick={() => setMainImageIndex(idx)}
                                            className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden relative ${
                                                idx === mainImageIndex ? "border-red-500" : "border-gray-200"
                                            }`}
                                        >
                                            <Image
                                                src={getImageUrl(img.url)}
                                                alt={`Thumbnail ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detail */}
                        <div className="md:w-1/2 p-4">
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600 text-sm">
                                    {product.listing.photo_profile ? (
                                        <Image
                                            src={
                                                product.listing.photo_profile.startsWith("http")
                                                    ? product.listing.photo_profile
                                                    : `${process.env.NEXT_PUBLIC_STORAGE_URL}${product.listing.photo_profile}`
                                            }
                                            alt={`${product.listing.first_name} profile`}
                                            width={20}
                                            height={20}
                                            className="rounded-full mr-1.5"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <User className="h-3.5 w-3.5 mr-1.5" />
                                    )}
                                    <span
                                        className="cursor-pointer hover:underline"
                                        onClick={() => {
                                            alert(`View profile of user ID: ${product.listing.user_id}`);
                                        }}
                                    >
                                        {product.listing.first_name} {product.listing.last_name || ""}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                    <span>Location info (add city/province later)</span>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-1.5">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            product.condition === "New"
                                                ? "bg-green-100 text-green-800"
                                                : product.condition === "Like New"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {product.condition}
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            product.status === "Available"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {product.status}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex gap-4 border-b border-gray-200">
                                        <button
                                            onClick={() => setActiveTab("description")}
                                            className={`pb-2 px-0.5 text-sm font-medium transition-colors ${
                                                activeTab === "description"
                                                    ? "text-red-600 border-b-2 border-red-600"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            Description
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("specification")}
                                            className={`pb-2 px-0.5 text-sm font-medium transition-colors ${
                                                activeTab === "specification"
                                                    ? "text-red-600 border-b-2 border-red-600"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            Specification
                                        </button>
                                    </div>

                                    <div className="pt-4">
                                        {activeTab === "description" ? (
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900 mb-2">
                                                    Product Overview
                                                </h2>
                                                <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                                                    {product.description}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {Object.entries(groupedSpecs).map(
                                                    ([category, specs]) =>
                                                        specs.length > 0 && (
                                                            <div key={category}>
                                                                <h3 className="text-base font-semibold text-red-600 bg-red-50 px-3 py-1.5 mb-2 rounded">
                                                                    {category}
                                                                </h3>
                                                                <div className="space-y-2 px-3">
                                                                    {specs.map((spec) => (
                                                                        <div
                                                                            key={spec.spec_id}
                                                                            className="flex border-b border-gray-100 pb-2"
                                                                        >
                                                                            <span className="font-medium text-gray-700 text-sm w-1/3">
                                                                                {spec.name}
                                                                            </span>
                                                                            <span className="text-gray-600 text-sm">: {spec.value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                {isGalleryOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/85"
                        onClick={() => setIsGalleryOpen(false)}
                    >
                        {/* Close Button (X) */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsGalleryOpen(false);
                            }}
                            className="cursor-pointer absolute top-4 right-4 z-50 text-white/90 hover:text-white p-2 transition-colors"
                            aria-label="Close gallery"
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Left - Full Height */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrev();
                            }}
                            className="cursor-pointer absolute left-0 top-0 bottom-24 z-40 text-white/70 hover:text-white px-4 flex items-center transition-colors hover:bg-white/5"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={60} strokeWidth={1.5} />
                        </button>

                        {/* Navigation Right - Full Height */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="cursor-pointer absolute right-0 top-0 bottom-24 z-40 text-white/70 hover:text-white px-4 flex items-center transition-colors hover:bg-white/5"
                            aria-label="Next image"
                        >
                            <ChevronRight size={60} strokeWidth={1.5} />
                        </button>

                        {/* Main Image Container - Centered Box */}
                        <div className="absolute inset-0 bottom-24 flex items-center justify-center p-8">
                            <div
                                className="relative rounded-lg shadow-2xl w-full max-w-5xl"
                                onClick={(e) => e.stopPropagation()}
                                style={{ height: '70vh' }}
                            >
                                <Image
                                    src={getImageUrl(product.images[currentGalleryIndex].url)}
                                    alt={`${product.title} - Image ${currentGalleryIndex + 1}`}
                                    fill
                                    className="object-contain p-4 rounded-lg"
                                    unoptimized
                                    priority
                                />
                            </div>
                        </div>

                        {/* Thumbnail Strip at Bottom */}
                        <div
                            className="cursor-pointer absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent flex items-center justify-center px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex gap-2 overflow-x-auto max-w-full py-2 px-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={img.image_id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentGalleryIndex(idx);
                                        }}
                                        className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden relative border-2 transition-all ${
                                            idx === currentGalleryIndex
                                                ? "border-red-500 scale-110"
                                                : "border-transparent opacity-60 hover:opacity-100 hover:border-r-red-500/50"
                                        }`}
                                    >
                                        <Image
                                            src={getImageUrl(img.url)}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </LayoutTemplate>
        </>
    );
}