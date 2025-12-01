import metaService from "@/services/meta_service";
import {Metadata} from "next";

class MetaHelper {
    // Helper: og:type
    getValidOpenGraphType(value: string | undefined): "website" | "article" | "book" | "profile" {
        if (value === "website" || value === "article" || value === "book" || value === "profile") {
            return value;
        }
        return "website";
    }

    // Helper: twitter:card
    getValidTwitterCard(value: string | undefined): "summary" | "summary_large_image" | "app" | "player" {
        if (value === "summary" || value === "summary_large_image" || value === "app" || value === "player") {
            return value;
        }
        return "summary_large_image";
    }

    async generatePageMetadata(pageKey: string): Promise<Metadata> {
        const metaItems = await metaService.getMetaData(pageKey);

        const metaLookup = metaItems?.reduce<Record<string, string>>((acc, item) => {
            acc[item.meta_name] = item.meta_value;
            return acc;
        }, {}) || {};

        const keywords = metaLookup["keywords"]
            ? metaLookup["keywords"].split(",").map(k => k.trim())
            : ["second hand", "used items", "marketplace indonesia", "buy sell used"];

        return {
            title: metaLookup["title"] || "XSELL - Buy & Sell Trusted Second-Hand Items",
            description: metaLookup["description"] || "Indonesia's most trusted second-hand marketplace. Negotiable prices, safe transactions, and quality pre-owned goods.",
            keywords,

            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },

            openGraph: {
                title: metaLookup["og:title"] || metaLookup["title"] || "XSELL",
                description: metaLookup["og:description"] || metaLookup["description"] || "Indonesia's most trusted second-hand marketplace.",
                url: metaLookup["og:url"] || process.env.SITE_URL || "https://xsell.id",
                siteName: metaLookup["og:site_name"] || "XSELL",
                images: metaLookup["og:image"]
                    ? [{
                        url: metaLookup["og:image"],
                        width: 1200,
                        height: 630,
                        alt: metaLookup["og:image:alt"] || "XSELL Marketplace"
                    }]
                    : [{
                        url: "/og-image.jpg",
                        width: 1200,
                        height: 630,
                        alt: "XSELL Marketplace"
                    }],
                locale: metaLookup["og:locale"] || "id_ID",
                type: metaHelper.getValidOpenGraphType(metaLookup["og:type"]),
            },

            twitter: {
                card: metaHelper.getValidTwitterCard(metaLookup["twitter:card"]),
                title: metaLookup["twitter:title"] || metaLookup["title"] || "XSELL",
                description: metaLookup["twitter:description"] || metaLookup["description"] || "Indonesia's most trusted second-hand marketplace.",
                images: metaLookup["twitter:image"]
                    ? [metaLookup["twitter:image"]]
                    : metaLookup["og:image"]
                        ? [metaLookup["og:image"]]
                        : ["/og-image.jpg"],
            },

            ...(metaLookup["canonical"] && {
                alternates: {
                    canonical: metaLookup["canonical"]
                }
            }),

            authors: metaLookup["author"]
                ? [{name: metaLookup["author"]}]
                : [{name: "XSELL Team"}],

            creator: metaLookup["author"] || "XSELL",
            publisher: "XSELL",

            ...(metaLookup["google-site-verification"] && {
                verification: {
                    google: metaLookup["google-site-verification"]
                }
            }),
        };
    }
}

export const metaHelper = new MetaHelper();
export default metaHelper;