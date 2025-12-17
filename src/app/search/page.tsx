import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import SearchResults from "@/components/search_result";
import type { Metadata } from "next";

export async function generateMetadata({
                                           searchParams,
                                       }: {
    searchParams: Promise<{ title?: string }>;
}): Promise<Metadata> {
    const { title } = await searchParams;
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    return {
        title: title ? `Search "${title}" - ${appName}` : `Search - ${appName}`,
        description: "Find products on our marketplace",
    };
}

export default function SearchPage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-56 md:mt-36">
                <SearchResults imagePrefixUrl={process.env.NEXT_PUBLIC_STORAGE_URL || ''} />
            </main>
            <Footer />
        </>
    );
}