import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import ProductByPage from "@/components/[slug]/product_by_page";

export default function PageBySectionKey() {
    return <>
        <HeaderCategories />
        <main className="min-h-screen mt-56 md:mt-36">
            <ProductByPage/>
        </main>
        <Footer />
    </>
}