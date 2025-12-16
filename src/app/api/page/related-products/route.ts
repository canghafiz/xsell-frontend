import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const categoryIds = searchParams.get("categoryIds");
        const limit = searchParams.get("limit");
        const excludeProductId = searchParams.get("excludeProductId");
        const latitude = searchParams.get("latitude");
        const longitude = searchParams.get("longitude");

        if (!categoryIds) {
            return NextResponse.json(
                { error: "Missing 'categoryIds' query parameter (e.g., 1,2,5)" },
                { status: 400 }
            );
        }

        // Validate excludeProductId
        const excludeId = excludeProductId ? parseInt(excludeProductId, 10) : 0;
        if (excludeProductId && (isNaN(excludeId) || excludeId <= 0)) {
            return NextResponse.json(
                { error: "'excludeProductId' must be a positive integer" },
                { status: 400 }
            );
        }

        // Validate latitude & longitude if provided
        let lat = 0.0;
        let lng = 0.0;
        if (latitude !== null && longitude !== null) {
            lat = parseFloat(latitude);
            lng = parseFloat(longitude);
            if (isNaN(lat) || isNaN(lng)) {
                return NextResponse.json(
                    { error: "'latitude' and 'longitude' must be valid numbers" },
                    { status: 400 }
                );
            }
        }

        const BE_API = process.env.BE_API; // e.g. "http://127.0.0.1:8002/api/v1/"
        if (!BE_API) {
            return NextResponse.json(
                { error: "Backend API (BE_API) is not configured" },
                { status: 500 }
            );
        }

        const baseUrl = BE_API.endsWith('/') ? BE_API : BE_API + '/';
        const backendPath = excludeId > 0
            ? `member/product/relatedByCategories/${excludeId}`
            : `member/product/relatedByCategories`;

        const backendUrl = new URL(backendPath, baseUrl);

        // Set required & optional params
        backendUrl.searchParams.set("categoryIds", categoryIds);
        if (limit) backendUrl.searchParams.set("limit", limit);
        if (latitude !== null && longitude !== null) {
            backendUrl.searchParams.set("latitude", latitude);
            backendUrl.searchParams.set("longitude", longitude);
        }

        console.log("Proxying to backend:", backendUrl.toString());

        const backendRes = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: { "Accept": "application/json" },
            // Optional: set timeout or cache behavior if needed
        });

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            console.error("Backend error response:", errorText);
            return NextResponse.json(
                { error: "Backend request failed", details: errorText },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Related products API error:", msg);
        return NextResponse.json(
            { error: "Internal server error", details: msg },
            { status: 500 }
        );
    }
}