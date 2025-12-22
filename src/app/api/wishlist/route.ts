import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

    let body: { user_id: number; product_id: number };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, code: 400, error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    if (!body.user_id || !body.product_id) {
        return NextResponse.json(
            {
                success: false,
                code: 400,
                error: "user_id and product_id are required",
            },
            { status: 400 }
        );
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader
        : `Bearer ${authHeader}`;

    const backendUrl = `${BE_API}member/wishlist`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                user_id: body.user_id,
                product_id: body.product_id,
            }),
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
                    error: "Failed to update wishlist",
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
        console.error("Wishlist API error:", error);
        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}
