import pageService from "@/services/page_service";
import LayoutTemplate from "@/components/layout";
import ScrollableSectionClient from "@/components/scrollable_section_client";
import { ProductDetailItem, ProductItem, RelatedProductApiResponse } from "@/types/product";

interface ProductDetailPageContentProps {
    product: ProductDetailItem;
}

export default async function ProductDetailPageContent({ product }: ProductDetailPageContentProps) {
    const categoryIds = product.category.category_id;

    const params = {
        except_id: product.product_id,
        limit: 100
    };

    const fetchPage = pageService.getPage("detail", params);

    const fetchRelated: Promise<RelatedProductApiResponse> = categoryIds
        ? pageService.getRelatedProducts({ categoryIds, limit: 100, excludeProductId: product.product_id })
        : Promise.resolve({
            success: false,
            code: 400,
            data: [],
            error: "No categories to fetch related products"
        });

    const [pages, relatedResponse] = await Promise.all([fetchPage, fetchRelated]);

    const sections = pages.data?.data || [];
    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || '';

    const relatedProducts: ProductItem[] = relatedResponse.success && Array.isArray(relatedResponse.data)
        ? relatedResponse.data
        : [];

    return (
        <div className="pb-4">
            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mb-16 bg-white py-6">
                    <LayoutTemplate>
                        <div className="py-6">
                            <div className="flex justify-between items-start mb-6 px-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Discover similar items you might also like
                                    </p>
                                </div>
                                <button className="text-red-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap hover:underline">
                                    View All →
                                </button>
                            </div>

                            <ScrollableSectionClient
                                products={relatedProducts}
                                imagePrefixUrl={imagePrefixUrl}
                            />
                        </div>
                    </LayoutTemplate>
                </section>
            )}

            {/* Other sections */}
            {sections.map((section, index) => (
                <section
                    key={section.section_id}
                    className={`mb-16 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} py-6`}
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