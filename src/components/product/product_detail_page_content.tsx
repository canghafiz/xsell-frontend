import pageService from "@/services/page_service";
import LayoutTemplate from "@/components/layout";
import ScrollableSectionClient from "@/components/scrollable_section_client";

export default async function ProductDetailPageContent() {
    const params = {
        trending: 10,
        like_new_items: 10,
    };

    const pages = await pageService.getPage("detail", params);
    const sections = pages.data?.data || [];
    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || '';

    return (
        <div className="pb-4">
            {sections.map((section, index) => (
                <section
                    key={section.section_id}
                    className={`mb-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} py-6`}
                >
                    <LayoutTemplate>
                        <div className="flex justify-between items-start mb-6 px-2">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                <p className="text-sm text-gray-600 mt-1">{section.subtitle}</p>
                            </div>
                            <button className="text-red-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap hover:underline">
                                View All →
                            </button>
                        </div>

                        <ScrollableSectionClient
                            products={section.products}
                            imagePrefixUrl={imagePrefixUrl}
                        />
                    </LayoutTemplate>
                </section>
            ))}
        </div>
    );
}