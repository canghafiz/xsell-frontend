import pageService from "@/services/page_service";
import LayoutTemplate from "@/components/layout";
import ProductCard from "@/components/product_card";
import HeroSection from "@/components/hero_section";

export default async function PageHome() {
    const params = {
        newly_listed: 10,
        trending: 10,
        like_new_items: 10,
        good_condition: 10,
        used_electronics: 10,
        home_items: 10,
        fashion_items: 10,
        editor_pick: 10,
    };

    const pages = await pageService.getPage("home", params);
    const sections = pages.data?.data || [];
    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || '';

    return (
        <div className="min-h-screen bg-white">
            {/* ✅ Hero sebagai komponen client */}
            <HeroSection />

            {/* Content */}
            <div className="py-10">
                {sections.map((section, index) => (
                    <section
                        key={section.section_id}
                        className={`mb-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} py-6`}
                    >
                        <LayoutTemplate>
                            {/* Section Header */}
                            <div className="flex justify-between items-start mb-6 px-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{section.subtitle}</p>
                                </div>
                                <button className="text-red-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap hover:underline">
                                    View All →
                                </button>
                            </div>

                            {/* Horizontal Scroll */}
                            <div className="px-2">
                                <div className="flex overflow-x-auto space-x-4 pb-2 hide-scrollbar">
                                    {section.products.map((product) => (
                                        <ProductCard
                                            key={product.product_id}
                                            product={product}
                                            imagePrefixUrl={imagePrefixUrl}
                                        />
                                    ))}
                                </div>
                            </div>
                        </LayoutTemplate>
                    </section>
                ))}
            </div>
        </div>
    );
}