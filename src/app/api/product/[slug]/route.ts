import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!slug || slug.trim() === "") {
        return NextResponse.json(
            { success: false, code: 400, error: "Slug is required" },
            { status: 400 }
        );
    }

    const BE_API = process.env.BE_API;
    if (!BE_API) {
        return NextResponse.json(
            { success: false, code: 500, error: "Backend API not configured" },
            { status: 500 }
        );
    }

    const backendUrl = `${BE_API}member/product/${encodeURIComponent(slug.trim())}`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
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
                    error: "Product not found or unavailable",
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
        console.error("Product API error:", msg);
        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}