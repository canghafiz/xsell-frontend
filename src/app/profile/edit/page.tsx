import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import EditProfile from "@/components/profile/edit_profile";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();

    const title = `${appName} - Edit Profile`;
    const description = `Edit your profile on ${appName}.`;
    const canonical = `${siteUrl}/edit-profile`;

    return {
        title,
        description,
        keywords: `online shopping, ${appName}`,
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
        alternates: { canonical },
        robots: { index: true, follow: true },
    };
}

export default function EditProfilePage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <EditProfile />
            </main>
            <Footer />
        </>
    );
}
