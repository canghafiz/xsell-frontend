import { MetaApiResponse, MetaItem } from "@/types/meta";

class MetaService {
    async getMetaData(pageKey: string): Promise<MetaItem[] | null> {
        const BE_API = process.env.BE_API;

        if (!BE_API) {
            console.error("BE_API environment variable is not set");
            return null;
        }

        const url = `${BE_API}meta/page/${pageKey}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 3600 }, // Cache 1 hour
            });

            if (!res.ok) {
                console.error(`Failed to fetch meta for "${pageKey}":`, res.status);
                return null;
            }

            const data: MetaApiResponse = await res.json();

            if (!data?.data || !Array.isArray(data.data)) {
                console.error("Invalid meta response structure", data);
                return null;
            }

            return data.data;
        } catch (error) {
            console.error("Error in MetaService.getMetaData:", error);
            return null;
        }
    }
}

export const metaService = new MetaService();
export default metaService;