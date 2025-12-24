import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import type {Metadata} from "next";
import LayoutTemplate from "@/components/layout";
import PrivacyPolicy from "@/components/privacy_policy";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();

    const title = `${appName} - Privacy Policy`;
    const description = `Privacy Policy explaining how ${appName} collects, uses, and protects user data.`;
    const canonical = `${siteUrl}/privacy-policy`;

    return {
        title,
        description,
        keywords: [
            "privacy policy",
            "data protection",
            "user privacy",
            appName,
        ],
        authors: [{ name: appName }],
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
        alternates: {
            canonical,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function ProfilePage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <LayoutTemplate>
                    <PrivacyPolicy/>
                </LayoutTemplate>
            </main>
            <Footer />
        </>
    );
}