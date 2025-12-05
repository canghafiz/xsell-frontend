import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ error: "Missing 'slug' query parameter" }, { status: 400 });
    }

    const BE_API = process.env.BE_API; // e.g. "http://127.0.0.1:8002/api/v1/"
    if (!BE_API) {
        return NextResponse.json({ error: "BE_API not configured" }, { status: 500 });
    }

    // Ambil semua query params, lalu hapus `slug`
    const backendParams = new URLSearchParams(searchParams.toString());
    backendParams.delete("slug"); // jangan kirim `slug` ke backend

    const queryString = backendParams.toString();
    const backendUrl = `${BE_API}member/page/${slug}${queryString ? `?${queryString}` : ""}`;

    try {
        const backendRes = await fetch(backendUrl, {
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
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}