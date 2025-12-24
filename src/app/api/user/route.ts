import { NextResponse } from "next/server";
import { AuthApiResponse } from "@/types/user";

const BE_API = process.env.BE_API;

/* =========================
   GET USER (PUBLIC)
   ========================= */
export async function GET(req: Request) {
    if (!BE_API) {
        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: "Server configuration error",
            } as AuthApiResponse,
            { status: 500 }
        );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
        return NextResponse.json(
            {
                success: false,
                code: 400,
                data: "user_id query param is required",
            } as AuthApiResponse,
            { status: 400 }
        );
    }

    try {
        const res = await fetch(`${BE_API}user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const data: AuthApiResponse = await res.json();

        return NextResponse.json(data, {
            status: data.code ?? res.status,
        });
    } catch (error) {
        const msg =
            error instanceof Error ? error.message : "Network error";

        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: msg,
            } as AuthApiResponse,
            { status: 500 }
        );
    }
}

/* =========================
   UPDATE USER (PROTECTED)
   ========================= */
export async function PUT(req: Request) {
    if (!BE_API) {
        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: "Server configuration error",
            } as AuthApiResponse,
            { status: 500 }
        );
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            {
                success: false,
                code: 401,
                data: "Invalid or missing Authorization header",
            } as AuthApiResponse,
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            {
                success: false,
                code: 400,
                data: "userId query param is required",
            } as AuthApiResponse,
            { status: 400 }
        );
    }

    const payload = await req.json();

    try {
        const res = await fetch(`${BE_API}member/user/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader,
            },
            body: JSON.stringify(payload),
        });

        const data: AuthApiResponse = await res.json();

        return NextResponse.json(data, {
            status: data.code ?? res.status,
        });
    } catch (error) {
        const msg =
            error instanceof Error ? error.message : "Network error";

        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: msg,
            } as AuthApiResponse,
            { status: 500 }
        );
    }
}
