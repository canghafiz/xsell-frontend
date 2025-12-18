import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import PostAttribute from "@/components/post/post_attribute";
import type {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const title = `${appName} - Attributes`;
    const description = `Fill your attribute post on ${appName}.`;
    const canonical = `${siteUrl}/post/attributes`;

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

export default function PostAttributesPage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <PostAttribute/>
            </main>
            <Footer />
        </>
    );
}