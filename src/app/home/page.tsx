import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function HomePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                <h1 className="sr-only">XSELL</h1>
            </main>
            <Footer />
        </>
    );
}