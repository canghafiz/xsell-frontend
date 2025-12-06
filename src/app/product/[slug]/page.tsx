import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import ProductDetail from "@/components/product/product_detail";
import ProductDetailPageContent from "@/components/product/product_detail_page_content";

export default function ProductDetailPage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-36 md:mt-36">
                <ProductDetail />
                <ProductDetailPageContent/>
            </main>
            <Footer />
        </>
    );
}