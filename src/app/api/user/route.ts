import { NextResponse } from "next/server";
import { AuthApiResponse } from "@/types/user";

export async function PUT(req: Request) {
    const BE_API = process.env.BE_API;

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
