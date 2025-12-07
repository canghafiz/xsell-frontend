import { productService } from "@/services/product_service";
import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import ProductDetail from "@/components/product/product_detail";
import ProductDetailPageContent from "@/components/product/product_detail_page_content";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const productRes = await productService.getDetailBySlug(slug);

    if (!productRes?.success || !productRes.data) {
        notFound();
    }

    const product = productRes.data;

    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-36 md:mt-36">
                <ProductDetail product={product} slug={slug} />
                <ProductDetailPageContent product={product} />
            </main>
            <Footer />
        </>
    );
}