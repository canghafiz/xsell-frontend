import Footer from "@/components/footer";
import Banners from "@/components/banners";
import HeaderCategories from "@/components/header_category";

export default async function HomePage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-36 md:mt-24">
                <Banners/>
            </main>
            <Footer />
        </>
    );
}