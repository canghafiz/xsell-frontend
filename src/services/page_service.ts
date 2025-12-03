import {ProductPageApiResponse} from "@/types/product";

class PageService {
    async getPage(slug: string, params?: Record<string, string | number>): Promise<ProductPageApiResponse> {
        const allParams = {
            slug,
            ...(params || {}),
        };

        const queryString = new URLSearchParams(
            Object.entries(allParams).map(([k, v]) => [k, String(v)])
        ).toString();

        const baseUrl = process.env.SITE_URL;
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
}

export const pageService = new PageService();
export default pageService;