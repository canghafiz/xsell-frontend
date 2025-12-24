import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import LayoutTemplate from "@/components/layout";
import ContactForm from "@/components/contact_form";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const canonical = `${siteUrl}/contact`;

    const title = `${appName} - Contact Us`;
    const description = `Contact ${appName} for questions, support, or feedback.`;

    return {
        title,
        description,
        keywords: `contact, support, ${appName}`,
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

export default function ContactPage() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com";

    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <LayoutTemplate>
                    <ContactForm appName={appName} contactEmail={contactEmail} />
                </LayoutTemplate>
            </main>
            <Footer />
        </>
    );
}
