import { ToAddressApiResponse, AutoCompleteApiResponse} from "@/types/map";

class MapService {
    private getApiUrl(path: string, params: Record<string, string | number> = {}): string {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";
        const queryString = new URLSearchParams(
            Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString();
        return `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;
    }

    async toAddress(lat: number, lon: number): Promise<ToAddressApiResponse> {
        try {
            const url = this.getApiUrl("/api/map/address", { lat, lon });
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!res.ok) {
                console.warn("toAddress non-OK response:", res.status, res.statusText);
            }

            const data = await res.json();
            return data as ToAddressApiResponse;
        } catch (error) {
            console.error("toAddress fetch error:", error);
            return {
                success: false,
                code: 500,
                data: null,
            };
        }
    }

    async autoComplete(q: string, limit: number = 5): Promise<AutoCompleteApiResponse> {
        try {
            const url = this.getApiUrl("/api/map/auto-complete", { q, limit });
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!res.ok) {
                console.warn("autoComplete non-OK response:", res.status, res.statusText);
            }

            const data = await res.json();
            return data as AutoCompleteApiResponse;
        } catch (error) {
            console.error("autoComplete fetch error:", error);
            return {
                success: false,
                code: 500,
                data: null,
            };
        }
    }
}

const mapService = new MapService();
export default mapService;
export { mapService };