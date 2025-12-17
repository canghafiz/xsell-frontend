import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import ProductByPage from "@/components/[slug]/product_by_page";
import type {Metadata} from "next";

const formatSlugToTitle = (slug: string): string =>
    slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

const formatSlugToSectionKey = (slug: string): string =>
    slug.replace(/-/g, "_");

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

export default async function PageBySectionKey({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = await params;
    return <>
        <HeaderCategories />
        <main className="min-h-screen mt-56 md:mt-36">
            <ProductByPage
                title={formatSlugToTitle(slug)}
                sectionKey={formatSlugToSectionKey(slug)}
                imagePrefixUrl={process.env.NEXT_PUBLIC_STORAGE_URL || ''}
            />
        </main>
        <Footer />
    </>
}