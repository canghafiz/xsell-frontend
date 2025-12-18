import HeaderCategories from "@/components/header_category";
import Footer from "@/components/footer";
import CategoryPost from "@/components/post/category_post";

export default function PostPage() {
    return (
        <>
            <HeaderCategories />
            <main className="min-h-screen mt-58 md:mt-36">
                <CategoryPost/>
            </main>
            <Footer />
        </>
    );
}