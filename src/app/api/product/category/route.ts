import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const categoryIds = searchParams.getAll('categoryIds');
    const sortBy = searchParams.get('sortBy');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset') || '0';

    if (!categoryIds || categoryIds.length === 0) {
        return NextResponse.json(
            { success: false, code: 400, error: "At least one categoryId is required" },
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

    const queryParams = new URLSearchParams();

    categoryIds.forEach(id => {
        queryParams.append('categoryIds', id);
    });

    if (sortBy) queryParams.append('sortBy', sortBy);
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (limit) queryParams.append('limit', limit);
    queryParams.append('offset', offset); // ✅ Add offset to backend call

    const backendUrl = `${BE_API}member/product/category?${queryParams.toString()}`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
            cache: 'no-store',
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