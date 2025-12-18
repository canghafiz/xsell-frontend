import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import SearchResults from "@/components/search_result";
import type { Metadata } from "next";

export async function generateMetadata({
                                           searchParams,
                                       }: {
    searchParams: Promise<{ title?: string }>;
}): Promise<Metadata> {
    const { title } = await searchParams;
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const description = `Find products on our marketplace on ${appName}.`;
    const canonical = `${siteUrl}/search?title=${title}`;

    return {
        title: title ? `Search "${title}" - ${appName}` : `Search - ${appName}`,
        description: description,
        keywords: `online shopping, ${appName}`,
        authors: [{ name: process.env.NEXT_PUBLIC_APP_NAME || "XSELL" }],
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: appName,
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

export default function SearchPage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-56 md:mt-36">
                <SearchResults imagePrefixUrl={process.env.NEXT_PUBLIC_STORAGE_URL || ''} />
            </main>
            <Footer />
        </>
    );
}