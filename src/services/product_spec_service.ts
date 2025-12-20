import {ProductSpecApiResponse} from "@/types/product_spec";

class ProductSpecService {
    async getBySubId(subId: number): Promise<ProductSpecApiResponse> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

            if (!baseUrl) {
                throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
            }

            if (!subId) {
                throw new Error("subId is required");
            }

            // build URL safely
            const url = new URL("/api/product/spec", baseUrl);
            url.searchParams.set("subId", String(subId));

            console.log("🔍 Calling product spec API:", url.toString());

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store", // IMPORTANT: spec is dynamic
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Product spec API error:", response.status, text);

                return {
                    success: false,
                    code: response.status,
                    data: [],
                };
            }

            return (await response.json()) as ProductSpecApiResponse;
        } catch (error) {
            console.error("Product spec fetch failed:", error);

            return {
                success: false,
                code: 500,
                data: [],
            };
        }
    }
}

export const productSpecService = new ProductSpecService();
export default productSpecService;