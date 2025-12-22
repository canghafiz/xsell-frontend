import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const productId = request.nextUrl.searchParams.get("id");

    if (!productId) {
        return NextResponse.json(
            { success: false, code: 400, error: "Product ID is required" },
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

    const authHeader =
        request.headers.get("authorization") ||
        request.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json(
            { success: false, code: 401, error: "Unauthorized" },
            { status: 401 }
        );
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader
        : `Bearer ${authHeader}`;

    const backendUrl = `${BE_API}member/product/${productId}`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: token,
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
                    error: "Failed to delete product",
                };
            }
            return NextResponse.json(errorResponse, {
                status: backendRes.status,
            });
        }

        return new NextResponse(rawText, {
            status: backendRes.status,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });
    } catch (error) {
        console.error("Delete Product API error:", error);
        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}
