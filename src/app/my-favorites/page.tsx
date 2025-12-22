import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import type {Metadata} from "next";
import TopOwnFavAds from "@/components/profile/top_own_fav_ads";
import LayoutTemplate from "@/components/layout";
import MyFavorites from "@/components/profile/my_favorites";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const title = `${appName} - My Favorites`;
    const description = `Your favorite ads is on ${appName}.`;
    const canonical = `${siteUrl}/my-favorites`;

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
        <LayoutTemplate>
            <main className="min-h-screen mt-58 md:mt-36">
                <TopOwnFavAds/>
                <MyFavorites/>
            </main>
        </LayoutTemplate>
        <Footer/>
    </>
}