import { NextResponse } from "next/server";

export async function GET() {
    const BE_API = process.env.BE_API;

    if (!BE_API) {
        return NextResponse.json(
            { success: false, code: 500, error: "Backend API not configured" },
            { status: 500 }
        );
    }

    const baseUrl = BE_API.endsWith("/") ? BE_API : BE_API + "/";
    const backendUrl = new URL("categories/", baseUrl);

    try {
        const backendRes = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            console.error("Backend error:", errorText);

            return NextResponse.json(
                {
                    success: false,
                    code: backendRes.status,
                    error: "Failed to fetch categories",
                },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Category API error:", msg);

        return NextResponse.json(
            { success: false, code: 500, error: "Internal server error" },
            { status: 500 }
        );
    }
}
