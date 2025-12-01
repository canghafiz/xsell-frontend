import Footer from "@/components/footer";
import Header from "@/components/header";
import Banners from "@/components/banners";

export default async function HomePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen mt-15">
                <Banners/>
            </main>
            <Footer />
        </>
    );
}