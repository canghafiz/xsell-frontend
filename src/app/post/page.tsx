import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import CategoryPost from "@/components/post/category_post";
import type {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const title = `${appName} - Post`;
    const description = `Choose your post category on ${appName}.`;
    const canonical = `${siteUrl}/post`;

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

export default function PostPage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <CategoryPost/>
            </main>
            <Footer />
        </>
    );
}