import { type Metadata } from "next";
import { cookies } from "next/headers";
import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import { productService } from "@/services/product_service";
import ProductCategoryContent from "@/components/category/product_category_content";

const formatSlugToTitle = (slug: string): string =>
    slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

// Helper function to get location from cookie
async function getUserLocationFromCookie(): Promise<{
    latitude: number;
    longitude: number;
} | null> {
    const cookieStore = await cookies();
    const userLocationCookie = cookieStore.get("user_location");
    if (!userLocationCookie?.value) return null;

    try {
        const loc = JSON.parse(decodeURIComponent(userLocationCookie.value));
        if (loc.latitude && loc.longitude) {
            return {
                latitude: loc.latitude,
                longitude: loc.longitude,
            };
        }
    } catch (err) {
        console.error("Failed to parse user_location cookie:", err);
    }
    return null;
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ subCategorySlug?: string | string[] }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const categoryName = formatSlugToTitle(slug);
    const title = `${appName} - ${categoryName}`;
    const description = `Discover the best products in the ${categoryName} category on ${appName}.`;
    const canonical = `${siteUrl}/categories/${slug}`;

    return {
        title,
        description,
        keywords: `${categoryName}, online shopping, ${appName}`,
        authors: [{ name: process.env.NEXT_PUBLIC_APP_NAME || "XSELL" }],
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: appName,
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
        alternates: { canonical },
        robots: { index: true, follow: true },
    };
}

export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ subCategorySlug?: string | string[] }>;
}) {
    const { slug } = await params;
    const sp = await searchParams;

    let subCategorySlugs: string[] = [];
    if (sp.subCategorySlug) {
        subCategorySlugs = Array.isArray(sp.subCategorySlug)
            ? sp.subCategorySlug
            : [sp.subCategorySlug];
    }

    // Get user location from cookie (server-side)
    const userLocation = await getUserLocationFromCookie();

    // Build params with proper typing
    interface ProductParams {
        categorySlug: string;
        subCategorySlug: string[];
        sortBy: string;
        minPrice: number;
        maxPrice: number;
        limit: number;
        latitude?: number;
        longitude?: number;
    }

    const productParams: ProductParams = {
        categorySlug: slug,
        subCategorySlug: subCategorySlugs,
        sortBy: "price_desc",
        minPrice: 0,
        maxPrice: 9999999999,
        limit: 21,
    };

    // Add location if exists
    if (userLocation) {
        productParams.latitude = userLocation.latitude;
        productParams.longitude = userLocation.longitude;
    }

    const initialProducts = await productService.getByCategory(productParams);

    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-56 md:mt-36">
                <ProductCategoryContent
                    initialProducts={initialProducts}
                    categorySlug={slug}
                    subCategorySlug={subCategorySlugs}
                    imagePrefixUrl={
                        process.env.NEXT_PUBLIC_STORAGE_URL || ""
                    }
                />
            </main>
            <Footer />
        </>
    );
}