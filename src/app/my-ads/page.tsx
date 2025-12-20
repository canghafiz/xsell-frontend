import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import type {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const title = `${appName} - My Ads`;
    const description = `Your listing ads is on ${appName}.`;
    const canonical = `${siteUrl}/my-ads`;

    return {
        title,
        description,
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

export default function MyAdsPage() {
    return <>
        <HeaderCategories />
        <main className="min-h-screen mt-48 md:mt-24">
        </main>
        <Footer />
    </>
}