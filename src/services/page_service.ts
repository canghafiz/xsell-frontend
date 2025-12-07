import {ProductPageApiResponse, RelatedProductApiResponse} from "@/types/product";

class PageService {
    async getPage(slug: string, params?: Record<string, string | number>): Promise<ProductPageApiResponse> {
        const allParams = {
            slug,
            ...(params || {}),
        };

        const queryString = new URLSearchParams(
            Object.entries(allParams).map(([k, v]) => [k, String(v)])
        ).toString();

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const url = `${baseUrl}/api/page${queryString ? `?${queryString}` : ""}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            const data = await res.json();
            return data as ProductPageApiResponse;
        } catch (error) {
            console.error("Page fetch error:", error);
            return {
                success: false,
                code: 500,
                data: { page_key: "", data: [] },
            };
        }
    }
    async getRelatedProducts(params?: Record<string, string | number>): Promise<RelatedProductApiResponse> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
            if (!baseUrl) {
                console.error("NEXT_PUBLIC_SITE_URL is not set");
                return { success: false, code: 500, data: [] };
            }

            const allParams = params || {};
            const queryString = new URLSearchParams(
                Object.entries(allParams).map(([k, v]) => [k, String(v)])
            ).toString();

            const url = `${baseUrl}/api/page/related-products${queryString ? `?${queryString}` : ''}`;

            console.log("Fetching related products from:", url);

            const res = await fetch(url, {
                method: "GET",
                headers: { "Accept": "application/json" },
                next: { revalidate: 60 },
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("API responded with error:", res.status, errorText);
                return { success: false, code: res.status, data: [] };
            }

            const data = await res.json();
            return data as RelatedProductApiResponse;
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error("Failed to fetch related products:", msg);
            return { success: false, code: 500, data: [] };
        }
    }
}

export const pageService = new PageService();
export default pageService;