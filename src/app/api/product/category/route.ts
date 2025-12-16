import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get("categorySlug");
    const subCategorySlugs = searchParams.getAll("subCategorySlug");
    const sortBy = searchParams.get("sortBy");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset") || "0";

    if (!categorySlug) {
        return NextResponse.json(
            { success: false, code: 400, error: "categorySlug is required" },
            { status: 400 }
        );
    }

    /** ===============================
     *  Ambil latitude & longitude
     *  =============================== */
    let latitude = searchParams.get("latitude");
    let longitude = searchParams.get("longitude");

    // fallback ke cookie user_location
    if ((!latitude || !longitude) && request.headers.get("cookie")) {
        const cookieHeader = request.headers.get("cookie")!;
        const match = cookieHeader.match(/user_location=([^;]+)/);

        if (match) {
            try {
                const decoded = decodeURIComponent(match[1]);
                const loc = JSON.parse(decoded);
                if (loc.latitude && loc.longitude) {
                    latitude = String(loc.latitude);
                    longitude = String(loc.longitude);
                }
            } catch (err) {
                console.error("Failed to parse user_location cookie:", err);
            }
        }
    }

    const BE_API = process.env.BE_API;
    if (!BE_API) {
        return NextResponse.json(
            { success: false, code: 500, error: "Backend API not configured" },
            { status: 500 }
        );
    }

    /** ===============================
     *  Build backend URL
     *  =============================== */
    const baseUrl = BE_API.endsWith("/") ? BE_API : BE_API + "/";
    const backendUrl = new URL("member/product/category", baseUrl);

    // required
    backendUrl.searchParams.set("categorySlug", categorySlug);

    // multiple subCategorySlug
    for (const slug of subCategorySlugs) {
        backendUrl.searchParams.append("subCategorySlug", slug);
    }

    // optional params
    if (sortBy) backendUrl.searchParams.set("sortBy", sortBy);
    if (minPrice) backendUrl.searchParams.set("minPrice", minPrice);
    if (maxPrice) backendUrl.searchParams.set("maxPrice", maxPrice);
    if (limit) backendUrl.searchParams.set("limit", limit);
    backendUrl.searchParams.set("offset", offset);

    // latitude & longitude
    if (latitude) backendUrl.searchParams.set("latitude", latitude);
    if (longitude) backendUrl.searchParams.set("longitude", longitude);

    try {
        const backendRes = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
        });

        const rawText = await backendRes.text();

        if (!backendRes.ok) {
            let errorResponse;
            try {
                errorResponse = JSON.parse(rawText);
            } catch {
                errorResponse = {
                    success: false,
                    code: backendRes.status,
                    error: "Products not found or unavailable",
                };
            }
            return NextResponse.json(errorResponse, { status: backendRes.status });
        }

        return new NextResponse(rawText, {
            status: backendRes.status,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Product Category API error:", msg);
        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}
