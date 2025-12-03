import Footer from "@/components/footer";
import Banners from "@/components/banners";
import HeaderCategories from "@/components/header_category";
import PageHome from "@/components/page_home";

export default async function HomePage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-36 md:mt-24">
                <Banners/>
                <PageHome/>
            </main>
            <Footer />
        </>
    );
}