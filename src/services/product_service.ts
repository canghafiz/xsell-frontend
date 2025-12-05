// services/productService.ts
import { ProductDetailApiResponse } from "@/types/product";

class ProductService {
    async getDetailBySlug(slug: string): Promise<ProductDetailApiResponse> {
        if (!slug) {
            return {
                success: false,
                code: 400,
                error: "Slug is required",
            };
        }

        const baseUrl = process.env.SITE_URL || "http://localhost:3000";
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
}

export const productService = new ProductService();
export default productService;