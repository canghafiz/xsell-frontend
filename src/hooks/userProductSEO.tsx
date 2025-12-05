import { useEffect } from "react";
import { ProductDetailItem } from "@/types/product";

export function useProductSEO(
    product: ProductDetailItem | null,
    slug: string,
    mainImageIndex: number
) {
    useEffect(() => {
        if (!product) return;

        const getImageUrl = (url: string) => {
            if (url.startsWith("http")) return url;
            return `${process.env.NEXT_PUBLIC_STORAGE_URL}${url}`;
        };

        const mainImage = product.images[mainImageIndex] || product.images.find((img) => img.is_primary) || product.images[0];
        const imageUrl = mainImage ? getImageUrl(mainImage.url) : "/placeholder-image.png";

        const title = `${product.title} - Rp${product.price.toLocaleString("id-ID")} | ${product.category.category_name}`;
        const description = product.description.substring(0, 160);
        const keywords = `${product.title}, ${product.category.category_name}, ${product.condition}, ${product.specs.map(s => s.value).join(", ")}`;
        const author = `${product.listing.first_name} ${product.listing.last_name || ""}`;
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/product/${slug}`;

        // Update document title
        document.title = title;

        // Helper function to update or create meta tag
        const updateMetaTag = (selector: string, attribute: string, value: string) => {
            let element = document.querySelector(selector) as HTMLMetaElement;
            if (!element) {
                element = document.createElement("meta");
                if (selector.includes("property=")) {
                    element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
                } else if (selector.includes("name=")) {
                    element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
                }
                document.head.appendChild(element);
            }
            element.setAttribute("content", value);
        };

        // Update canonical link
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = url;

        // Primary Meta Tags
        updateMetaTag('meta[name="description"]', "content", description);
        updateMetaTag('meta[name="keywords"]', "content", keywords);
        updateMetaTag('meta[name="author"]', "content", author);

        // Open Graph
        updateMetaTag('meta[property="og:type"]', "content", "product");
        updateMetaTag('meta[property="og:url"]', "content", url);
        updateMetaTag('meta[property="og:title"]', "content", `${product.title} - Rp${product.price.toLocaleString("id-ID")}`);
        updateMetaTag('meta[property="og:description"]', "content", description);
        updateMetaTag('meta[property="og:image"]', "content", imageUrl);
        updateMetaTag('meta[property="og:site_name"]', "content", "Your Site Name");
        updateMetaTag('meta[property="product:price:amount"]', "content", product.price.toString());
        updateMetaTag('meta[property="product:price:currency"]', "content", "IDR");
        updateMetaTag('meta[property="product:condition"]', "content", product.condition.toLowerCase());
        updateMetaTag('meta[property="product:availability"]', "content", product.status === "Available" ? "in stock" : "out of stock");

        // Twitter
        updateMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
        updateMetaTag('meta[name="twitter:url"]', "content", url);
        updateMetaTag('meta[name="twitter:title"]', "content", `${product.title} - Rp${product.price.toLocaleString("id-ID")}`);
        updateMetaTag('meta[name="twitter:description"]', "content", description);
        updateMetaTag('meta[name="twitter:image"]', "content", imageUrl);

        // Additional SEO
        updateMetaTag('meta[name="robots"]', "content", "index, follow");
        updateMetaTag('meta[name="language"]', "content", "Indonesian");

    }, [product, slug, mainImageIndex]);
}