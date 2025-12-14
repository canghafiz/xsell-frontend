import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json(
            { error: "Both 'lat' and 'lon' query parameters are required" },
            { status: 400 }
        );
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
        return NextResponse.json(
            { error: "'lat' and 'lon' must be valid numbers" },
            { status: 400 }
        );
    }

    if (latNum < -90 || latNum > 90) {
        return NextResponse.json({ error: "'lat' must be between -90 and 90" }, { status: 400 });
    }
    if (lonNum < -180 || lonNum > 180) {
        return NextResponse.json({ error: "'lon' must be between -180 and 180" }, { status: 400 });
    }

    const BE_API = process.env.BE_API;
    if (!BE_API) {
        return NextResponse.json(
            { error: "Backend API (BE_API) is not configured" },
            { status: 500 }
        );
    }

    // Pastikan tidak ada trailing slash
    const baseUrl = BE_API.replace(/\/+$/, "");
    const backendUrl = `${baseUrl}/map/getAddress?lat=${encodeURIComponent(latNum)}&lon=${encodeURIComponent(lonNum)}`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        const rawText = await backendRes.text();

        return new NextResponse(rawText, {
            status: backendRes.status,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Reverse geocoding proxy error:", msg);
        return NextResponse.json(
            { error: "Failed to fetch address from backend", details: msg },
            { status: 500 }
        );
    }
}