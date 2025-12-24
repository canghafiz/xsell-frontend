import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import FAQSection from "@/components/faq_section";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const canonical = `${siteUrl}/faq`;

    const title = `${appName} - FAQ`;
    const description = `Frequently Asked Questions about buying and selling second-hand items on ${appName}.`;

    return {
        title,
        description,
        keywords: `FAQ, questions, second-hand items, ${appName}`,
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

export default function FAQPage() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";

    const faqItems = [
        {
            question: "How do I buy items on this platform?",
            answer: `Select the item you want and contact the seller directly through the real-time chat feature available on ${appName}.`
        },
        {
            question: "How do I sell items on this platform?",
            answer: `Create an account, upload photos and descriptions of your item, set a price, and publish your listing. Buyers will contact you directly via the chat feature.`
        },
        {
            question: "Are there any fees to create a listing?",
            answer: `Using ${appName} to create listings is completely free.`
        },
        {
            question: "How can I edit or remove my listing?",
            answer: `Go to your account, select the listing you want to edit or delete, and make changes using the available options.`
        },
        {
            question: "How can I communicate with a seller or buyer?",
            answer: `Use the real-time chat feature on the item page to communicate directly with the seller or buyer.`
        },
        {
            question: `Is ${appName} responsible if a transaction goes wrong?`,
            answer: `${appName} only acts as a platform for listings. All agreements are made directly between buyers and sellers. Please communicate and inspect items before completing a transaction.`
        },
        {
            question: "How can I report an issue or suspicious user?",
            answer: `Contact our support team via the support feature on ${appName} if you encounter any issues or suspicious behavior.`
        }
    ];

    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <FAQSection appName={appName} faqItems={faqItems}/>
            </main>
            <Footer />
        </>
    );
}
