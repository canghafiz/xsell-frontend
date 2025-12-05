"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ProductDetailItem, ProductDetailApiResponse } from "@/types/product";
import { productService } from "@/services/product_service";
import { Loader, AlertCircle, MapPin, User } from "lucide-react";
import LayoutTemplate from "@/components/layout";
import { useProductSEO } from "@/hooks/userProductSEO";
import Head from "next/head";

export default function ProductDetail() {
    const params = useParams();
    const slugParam = params?.slug;

    const [product, setProduct] = useState<ProductDetailItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<"description" | "specification">("description");

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
                <Loader className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="h-96 bg-gray-200 rounded-lg"></div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-16 w-16 bg-gray-200 rounded shrink-0"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-10 bg-red-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="pt-4 space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h2 className="text-xl font-semibold text-gray-800 mt-4">
                    {error || "Product not found"}
                </h2>
                <p className="text-gray-600 mt-2">
                    Please check the URL or try again later.
                </p>
            </div>
        );
    }

    const primaryImage = product.images.find((img) => img.is_primary);
    const mainImage = product.images[mainImageIndex] || primaryImage || product.images[0];

    // Handle image URL (prefix if relative)
    const getImageUrl = (url: string) => {
        if (url.startsWith("http")) return url;
        return `${process.env.NEXT_PUBLIC_STORAGE_URL}${url}`;
    };

    // Group specs by category
    const groupedSpecs: { [key: string]: typeof product.specs } = {
        General: [],
        "Processor and Performance": [],
        Other: [],
    };

    product.specs.forEach((spec) => {
        const name = spec.name.toLowerCase();
        if (name.includes("brand") || name.includes("series") || name.includes("operating")) {
            groupedSpecs.General.push(spec);
        } else if (name.includes("processor") || name.includes("core")) {
            groupedSpecs["Processor and Performance"].push(spec);
        } else {
            groupedSpecs.Other.push(spec);
        }
    });

    return (
        <>
            {product && (
                <Head>
                    {/* Primary Meta Tags */}
                    <title>{`${product.title} - Rp${product.price.toLocaleString("id-ID")} | ${product.category.category_name}`}</title>
                    <meta name="title" content={`${product.title} - Rp${product.price.toLocaleString("id-ID")}`} />
                    <meta name="description" content={product.description.substring(0, 160)} />
                    <meta name="keywords" content={`${product.title}, ${product.category.category_name}, ${product.condition}, ${product.specs.map(s => s.value).join(", ")}`} />
                    <meta name="author" content={`${product.listing.first_name} ${product.listing.last_name || ""}`} />
                    <link rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${slugParam}`} />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="product" />
                    <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${slugParam}`} />
                    <meta property="og:title" content={`${product.title} - Rp${product.price.toLocaleString("id-ID")}`} />
                    <meta property="og:description" content={product.description.substring(0, 160)} />
                    <meta property="og:image" content={mainImage ? getImageUrl(mainImage.url) : "/placeholder-image.png"} />
                    <meta property="og:site_name" content="Your Site Name" />
                    <meta property="product:price:amount" content={product.price.toString()} />
                    <meta property="product:price:currency" content="IDR" />
                    <meta property="product:condition" content={product.condition.toLowerCase()} />
                    <meta property="product:availability" content={product.status === "Available" ? "in stock" : "out of stock"} />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${slugParam}`} />
                    <meta name="twitter:title" content={`${product.title} - Rp${product.price.toLocaleString("id-ID")}`} />
                    <meta name="twitter:description" content={product.description.substring(0, 160)} />
                    <meta name="twitter:image" content={mainImage ? getImageUrl(mainImage.url) : "/placeholder-image.png"} />

                    {/* Additional SEO */}
                    <meta name="robots" content="index, follow" />
                    <meta name="language" content="Indonesian" />
                    <meta name="revisit-after" content="7 days" />
                </Head>
            )}
            <LayoutTemplate>
                <div className="bg-white rounded-xl shadow-md overflow-hidden my-2">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                {product.category.category_name}
                            </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                                    {product.title}
                                </h1>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl md:text-3xl font-extrabold text-red-600">
                                    Rp{product.price.toLocaleString("id-ID")}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Price</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:flex">
                        {/* Gambar */}
                        <div className="md:w-1/2 p-6 border-r border-gray-100">
                            {mainImage ? (
                                <div className="bg-gray-50 rounded-lg overflow-hidden relative h-96">
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
                                <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                                    <span className="text-gray-400">No image available</span>
                                </div>
                            )}

                            {product.images.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={img.image_id}
                                            onClick={() => setMainImageIndex(idx)}
                                            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden relative ${
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
                        <div className="md:w-1/2 p-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>
                                    {product.listing.first_name} {product.listing.last_name || ""}
                                </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>Location info (add city/province later)</span>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            product.status === "Available"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                    {product.status}
                                </span>
                                </div>

                                {/* Tabs */}
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex gap-6 border-b border-gray-200">
                                        <button
                                            onClick={() => setActiveTab("description")}
                                            className={`pb-3 px-1 font-medium transition-colors ${
                                                activeTab === "description"
                                                    ? "text-red-600 border-b-2 border-red-600"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            Description
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("specification")}
                                            className={`pb-3 px-1 font-medium transition-colors ${
                                                activeTab === "specification"
                                                    ? "text-red-600 border-b-2 border-red-600"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            Specification
                                        </button>
                                    </div>

                                    <div className="pt-6">
                                        {activeTab === "description" ? (
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                                    Product Overview
                                                </h2>
                                                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {product.description}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {Object.entries(groupedSpecs).map(
                                                    ([category, specs]) =>
                                                        specs.length > 0 && (
                                                            <div key={category}>
                                                                <h3 className="text-lg font-semibold text-red-600 bg-red-50 px-4 py-2 mb-3">
                                                                    {category}
                                                                </h3>
                                                                <div className="space-y-3 px-4">
                                                                    {specs.map((spec) => (
                                                                        <div
                                                                            key={spec.spec_id}
                                                                            className="flex border-b border-gray-100 pb-3"
                                                                        >
                                                                        <span className="font-medium text-gray-700 w-1/3">
                                                                            {spec.name}
                                                                        </span>
                                                                            <span className="text-gray-600">: {spec.value}</span>
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
            </LayoutTemplate>
        </>
    );
}