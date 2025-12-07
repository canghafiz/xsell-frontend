import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const slug = searchParams.get("slug");
    const exceptId = searchParams.get("except_id");

    if (!slug || slug.trim() === "") {
        return NextResponse.json(
            { error: "Missing 'slug' query parameter" },
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

    const baseUrl = BE_API.endsWith('/') ? BE_API : BE_API + '/';

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

    for (const [key, value] of searchParams.entries()) {
        if (key !== "slug" && key !== "except_id") {
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