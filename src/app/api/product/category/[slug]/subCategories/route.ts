import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug: categorySlug } = await params;

    if (!categorySlug) {
        return NextResponse.json(
            { success: false, code: 400, error: "categorySlug is required" },
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

    const backendUrl = `${BE_API}member/category/${encodeURIComponent(categorySlug)}/subCategories`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
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
                    error: "Failed to fetch subcategories",
                };
            }
            return NextResponse.json(errorResponse, { status: backendRes.status });
        }

        // Forward the backend response as-is
        return new NextResponse(rawText, {
            status: backendRes.status,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("SubCategories API error:", msg);
        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}