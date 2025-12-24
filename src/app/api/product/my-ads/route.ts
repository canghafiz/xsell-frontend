import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const sortBy = searchParams.get("sortBy") || "new_to_oldest";

    if (!userId) {
        return NextResponse.json(
            { success: false, code: 400, error: "userId is required" },
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

    /** ===============================
     *  Build backend URL
     *  =============================== */
    const baseUrl = BE_API.endsWith("/") ? BE_API : BE_API + "/";
    const backendUrl = new URL(`member/product/user/${userId}`, baseUrl);

    backendUrl.searchParams.set("sortBy", sortBy);

    try {
        const backendRes = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: {
                Accept: "application/json",
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
                    error: "Failed to fetch user products",
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
        console.error("User Product API error:", msg);
        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}
