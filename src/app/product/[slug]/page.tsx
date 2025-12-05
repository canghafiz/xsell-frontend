import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import ProductDetail from "@/components/product/product_detail";

export default function ProductDetailPage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-48 md:mt-36">
                <ProductDetail />
            </main>
            <Footer />
        </>
    );
}