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

export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ subCategorySlug?: string | string[] }>;
}) {
    const { slug } = await params;
    const sp = await searchParams;

    // Normalize subCategorySlug to string[]
    let subCategorySlugs: string[] = [];
    if (sp.subCategorySlug) {
        if (Array.isArray(sp.subCategorySlug)) {
            subCategorySlugs = sp.subCategorySlug;
        } else {
            subCategorySlugs = [sp.subCategorySlug];
        }
    }

    const initialProducts = await productService.getByCategory({
        categorySlug: slug,
        subCategorySlug: subCategorySlugs,
        sortBy: 'price_desc',
        minPrice: 0,
        maxPrice: 9999999999,
        limit: 21,
    });

    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";

    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-48 md:mt-36">
                <ProductCategoryContent
                    initialProducts={initialProducts}
                    categorySlug={slug}
                    subCategorySlug={subCategorySlugs}
                    imagePrefixUrl={imagePrefixUrl}
                />
            </main>
            <Footer />
        </>
    );
}