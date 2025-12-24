// app/terms/page.tsx
import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import LayoutTemplate from "@/components/layout";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();
    const canonical = `${siteUrl}/terms`;

    const title = `${appName} - Terms of Use`;
    const description = `Terms of Use for using ${appName}.`;

    return {
        title,
        description,
        keywords: `terms, usage policy, ${appName}`,
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

export default function TermsPage() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@example.com";

    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <LayoutTemplate>
                    <section className="mb-4 bg-white rounded-lg shadow-sm p-6 md:p-10 text-gray-700">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Terms of Use
                        </h1>

                        <p className="mb-2 text-sm text-gray-500">
                            Effective Date: {new Date().toLocaleDateString("id-ID")}
                        </p>

                        <p className="mb-4">
                            By accessing or using <strong>{appName}</strong>, you agree to comply with these Terms of Use.
                            Please read them carefully before using our platform.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                            1. Use of Platform
                        </h2>
                        <p className="mb-4">
                            You may use {appName} only for lawful purposes. You agree not to use the platform for fraudulent activities, illegal transactions, or to infringe on others' rights.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                            2. User Accounts
                        </h2>
                        <p className="mb-4">
                            You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                            3. Content
                        </h2>
                        <p className="mb-4">
                            Any content you upload or share on {appName} must comply with applicable laws and should not violate the rights of others. {appName} reserves the right to remove content that violates these Terms.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                            4. Limitation of Liability
                        </h2>
                        <p className="mb-4">
                            {appName} is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the platform.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                            5. Modifications to Terms
                        </h2>
                        <p className="mb-4">
                            We may update these Terms of Use from time to time. Changes will be posted on this page with an updated effective date.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                            6. Contact Us
                        </h2>
                        <p className="mb-4">
                            If you have any questions regarding these Terms, please contact us at{" "}
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-red-600 underline"
                            >
                                {contactEmail}
                            </a>.
                        </p>
                    </section>
                </LayoutTemplate>
            </main>
            <Footer />
        </>
    );
}
