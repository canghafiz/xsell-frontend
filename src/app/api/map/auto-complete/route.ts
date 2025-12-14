import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q");
    const limit = searchParams.get("limit") || "5";

    if (!q || q.trim() === "") {
        return NextResponse.json(
            { error: "'q' query parameter is required" },
            { status: 400 }
        );
    }

    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 20) {
        return NextResponse.json(
            { error: "'limit' must be a number between 1 and 20" },
            { status: 400 }
        );
    }

    const BE_API = process.env.BE_API;
    if (!BE_API) {
        return NextResponse.json(
            { error: "Backend API (BE_API) is not configured" },
            { status: 500 }
        );
    }

    // Ensure BE_API ends without trailing slash
    const baseUrl = BE_API.replace(/\/+$/, "");
    const backendUrl = `${baseUrl}/map/autoComplete?q=${encodeURIComponent(q.trim())}&limit=${limitNum}`;

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
        console.error("Map auto-complete proxy error:", msg);
        return NextResponse.json(
            { error: "Failed to fetch auto-complete results", details: msg },
            { status: 500 }
        );
    }
}