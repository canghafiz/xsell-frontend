import { type Metadata } from "next";
import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import { productService } from "@/services/product_service";
import ProductCategoryContent from "@/components/category/product_category_content";

const formatSlugToTitle = (slug: string): string =>
    slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

const getCategoryIdFromSlug = (slug: string): number[] => {
    const categoryMap: Record<string, number[]> = {
        'electronics': [2],
        'fashion': [5],
        'home-garden': [3],
        'sports': [7],
        'electronics-fashion': [2, 5],
    };

    return categoryMap[slug] || [];
};

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const categoryName = formatSlugToTitle(slug);
    const title = `${appName} - ${categoryName}`;
    const description = `Discover the best products in the ${categoryName} category on ${appName}.`;
    const canonical = `${siteUrl}/categories/${slug}`;

    return {
        title,
        description,
        keywords: `${categoryName}, online shopping, ${appName}`,
        authors: [{ name: "Bebaserror" }],
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const categoryName = formatSlugToTitle(slug);
    const categoryIds = getCategoryIdFromSlug(slug);

    if (categoryIds.length === 0) {
        return (
            <>
                <HeaderCategories />
                <main className="min-h-screen mt-48 md:mt-36 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <p className="text-yellow-800">Category not found or not configured.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Initial fetch
    const initialProducts = await productService.getByCategory({
        categoryIds,
        sortBy: 'price_desc',
        minPrice: 0,
        maxPrice: 9999999999,
        limit: 21,
    });

    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";

    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-48 md:mt-36 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryName}</h1>
                    </div>

                    <ProductCategoryContent
                        initialProducts={initialProducts}
                        categoryIds={categoryIds}
                        imagePrefixUrl={imagePrefixUrl}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}