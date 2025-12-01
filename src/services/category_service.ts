import {CategoriesApiResponse, CategoryItem} from "@/types/category";

class CategoryService {
    async getCategories(): Promise<CategoryItem[] | null> {
        const BE_API = process.env.BE_API;

        if (!BE_API) {
            console.error("BE_API environment variable is not set");
            return null;
        }

        const url = `${BE_API}categories/`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 3600 }, // Cache 1 hour
            });

            if (!res.ok) {
                console.error(`Failed to fetch categories:`, res.status);
                return null;
            }

            const data: CategoriesApiResponse = await res.json();

            if (!data?.data || !Array.isArray(data.data)) {
                console.error("Invalid banner response structure", data);
                return null;
            }

            return data.data;
        } catch (error) {
            console.error("Error in CategoryService.getCategories:", error);
            return null;
        }
    }
}

export const categoryService = new CategoryService();
export default categoryService;