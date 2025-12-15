import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Get required slug and optional except_id
    const slug = searchParams.get("slug");
    const exceptId = searchParams.get("except_id");

    if (!slug || slug.trim() === "") {
        return NextResponse.json(
            { error: "Missing 'slug' query parameter" },
            { status: 400 }
        );
    }

    // Get latitude & longitude from query params
    let latitude = searchParams.get("latitude");
    let longitude = searchParams.get("longitude");

    // If latitude/longitude are missing, try reading from cookie
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

    const BACKEND_API = process.env.BE_API;
    if (!BACKEND_API) {
        return NextResponse.json(
            { error: "Backend API (BE_API) is not configured" },
            { status: 500 }
        );
    }

    const baseUrl = BACKEND_API.endsWith("/") ? BACKEND_API : BACKEND_API + "/";

    let backendPath = `member/page/${encodeURIComponent(slug.trim())}`;
    if (exceptId && exceptId.trim() !== "") {
        if (!/^\d+$/.test(exceptId.trim())) {
            return NextResponse.json(
                { error: "'except_id' must be a positive integer" },
                { status: 400 }
            );
        }
        backendPath += `/${encodeURIComponent(exceptId.trim())}`;
    }

    const backendUrl = new URL(backendPath, baseUrl);

    // Set latitude & longitude query params to backend
    if (latitude) backendUrl.searchParams.set("latitude", latitude);
    if (longitude) backendUrl.searchParams.set("longitude", longitude);

    // Pass along other query params (excluding slug, except_id, latitude, longitude)
    for (const [key, value] of searchParams.entries()) {
        if (!["slug", "except_id", "latitude", "longitude"].includes(key)) {
            backendUrl.searchParams.set(key, value);
        }
    }

    try {
        const backendRes = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: { "Accept": "application/json" },
        });

        const rawText = await backendRes.text();

        return new NextResponse(rawText, {
            status: backendRes.status,
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Page API proxy error:", msg);
        return NextResponse.json(
            { error: "Failed to fetch from backend", details: msg },
            { status: 500 }
        );
    }
}
