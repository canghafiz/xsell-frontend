import {ByCategoryProductApiResponse, ProductDetailApiResponse} from "@/types/product";

class ProductService {
    async getDetailBySlug(slug: string): Promise<ProductDetailApiResponse> {
        if (!slug) {
            return {
                success: false,
                code: 400,
                error: "Slug is required",
            };
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const url = `${baseUrl}/api/product/${encodeURIComponent(slug)}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: { "Accept": "application/json" },
            });

            if (!res.ok) {
                try {
                    const errorData = await res.json();
                    return errorData as ProductDetailApiResponse;
                } catch {
                    return {
                        success: false,
                        code: res.status,
                        error: "Failed to fetch product",
                    };
                }
            }

            const data = await res.json();
            return data as ProductDetailApiResponse;
        } catch (error) {
            console.error("Product fetch error:", error);
            return {
                success: false,
                code: 500,
                error: "Network error",
            };
        }
    }
    async getByCategory(params: {
        categoryIds: number[];
        sortBy?: string;
        minPrice?: number;
        maxPrice?: number;
        limit?: number;
    }): Promise<ByCategoryProductApiResponse> {
        const { categoryIds, sortBy, minPrice, maxPrice, limit } = params;

        if (!categoryIds || categoryIds.length === 0) {
            return {
                success: false,
                code: 400,
                error: "At least one category ID is required",
            };
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        // Build query string
        const queryParams = new URLSearchParams();

        // Add multiple categoryIds
        categoryIds.forEach(id => {
            queryParams.append('categoryIds', id.toString());
        });

        // Add optional params
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
        if (limit !== undefined) queryParams.append('limit', limit.toString());

        const url = `${baseUrl}/api/product/category?${queryParams.toString()}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: { "Accept": "application/json" },
                cache: 'no-store', // Prevent caching for fresh data
            });

            if (!res.ok) {
                try {
                    const errorData = await res.json();
                    return errorData as ByCategoryProductApiResponse;
                } catch {
                    return {
                        success: false,
                        code: res.status,
                        error: "Failed to fetch products by category",
                    };
                }
            }

            const data = await res.json();
            return data as ByCategoryProductApiResponse;
        } catch (error) {
            console.error("Product category fetch error:", error);
            return {
                success: false,
                code: 500,
                error: "Network error",
            };
        }
    }
}

export const productService = new ProductService();
export default productService;