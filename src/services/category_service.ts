import {
    CategoriesApiResponse,
    CategoryItem,
    CategoryWithSubCategory,
    CategoryWithSubCategoryApiResponse
} from "@/types/category";

class CategoryService {
    async getCategories(): Promise<CategoryItem[] | null> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
            if (!baseUrl) {
                throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
            }

            const url = `${baseUrl}/api/category`;


            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                next: { revalidate: 3600 * 24 },
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch categories:", res.status, text);
                return null;
            }

            const data: CategoriesApiResponse = await res.json();

            if (!data?.data || !Array.isArray(data.data)) {
                console.error("Invalid categories response structure", data);
                return null;
            }

            return data.data;
        } catch (error) {
            console.error("Error in CategoryService.getCategories:", error);
            return null;
        }
    }

    async getCategoriesWithSub(): Promise<CategoryWithSubCategory[] | null> {
        const url = `/api/category/withSub`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 3600 },
            });

            if (!res.ok) {
                console.error(`Failed to fetch categories from route handler:`, res.status, await res.text());
                return null;
            }

            const data: CategoryWithSubCategoryApiResponse = await res.json();

            if (!data?.data || !Array.isArray(data.data)) {
                console.error("Invalid categories response structure", data);
                return null;
            }

            return data.data;
        } catch (error) {
            console.error("Error in CategoryService.getCategoriesWithSub:", error);
            return null;
        }
    }
}

export const categoryService = new CategoryService();
export default categoryService;