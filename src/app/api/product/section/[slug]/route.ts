import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
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

    // Get all query parameters from the request
    const { searchParams } = new URL(request.url);

    // Build backend URL with query parameters
    const backendUrl = new URL(`${BE_API}member/product/section/${encodeURIComponent(slug.trim())}`);

    // Forward all query parameters to backend
    searchParams.forEach((value, key) => {
        backendUrl.searchParams.append(key, value);
    });

    try {
        const backendRes = await fetch(backendUrl.toString(), {
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
                    error: "Product section not found or unavailable",
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
        console.error("Product section API error:", msg);
        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}