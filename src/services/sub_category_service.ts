import { SubCategoriesApiResponse } from "@/types/sub_category";

class SubCategoryService {
    async getByCategorySlug(slug: string): Promise<SubCategoriesApiResponse> {
        if (!slug) {
            return {
                success: false,
                code: 400,
                data: "Slug is required",
            };
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const url = `${baseUrl}/api/product/category/${encodeURIComponent(slug)}/subCategories`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: { "Accept": "application/json" },
                cache: "no-store",
            });

            if (!res.ok) {
                try {
                    const errorData = await res.json();
                    return errorData as SubCategoriesApiResponse;
                } catch {
                    return {
                        success: false,
                        code: res.status,
                        data: "Failed to fetch subcategories",
                    };
                }
            }

            const data = await res.json();
            return data as SubCategoriesApiResponse;
        } catch (error) {
            console.error("Subcategories fetch error:", error);
            return {
                success: false,
                code: 500,
                data: "Network error",
            };
        }
    }
}

const subCategoryService = new SubCategoryService();
export { subCategoryService };
export default subCategoryService;