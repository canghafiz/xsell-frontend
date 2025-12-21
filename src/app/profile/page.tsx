import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import type {Metadata} from "next";
import MyProfile from "@/components/profile/my_profile";
import LayoutTemplate from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const title = `${appName} - Profile`;
    const description = `Your profile on ${appName}.`;
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

export default function ProfilePage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <LayoutTemplate>
                    <MyProfile />
                </LayoutTemplate>
            </main>
            <Footer />
        </>
    );
}