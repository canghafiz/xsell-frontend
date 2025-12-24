import { NextResponse } from "next/server";
import { AuthApiResponse, ChangePwPayload } from "@/types/user";

export async function POST(req: Request) {
    const BE_API = process.env.BE_API;

    if (!BE_API) {
        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: "Server configuration error",
            } satisfies AuthApiResponse,
            { status: 500 }
        );
    }

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                code: 400,
                data: "Missing or invalid Authorization header",
            } satisfies AuthApiResponse,
            { status: 400 }
        );
    }

    try {
        const payload: ChangePwPayload = await req.json();

        const res = await fetch(`${BE_API}member/product/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data: AuthApiResponse = await res.json();
        return NextResponse.json(data, { status: data.code });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Network error";
        console.error("Change password error:", msg);

        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: msg,
            } satisfies AuthApiResponse,
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    const BE_API = process.env.BE_API;

    if (!BE_API) {
        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: "Server configuration error",
            } satisfies AuthApiResponse,
            { status: 500 }
        );
    }

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                code: 400,
                data: "Missing or invalid Authorization header",
            } satisfies AuthApiResponse,
            { status: 400 }
        );
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("post_id");

    if (!postId) {
        return NextResponse.json(
            {
                success: false,
                code: 400,
                data: "Missing post_id query parameter",
            } satisfies AuthApiResponse,
            { status: 400 }
        );
    }

    try {
        const payload: ChangePwPayload = await req.json();

        const res = await fetch(
            `${BE_API}member/product/${postId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data: AuthApiResponse = await res.json();
        return NextResponse.json(data, { status: data.code });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Network error";
        console.error("Update product error:", msg);

        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: msg,
            } satisfies AuthApiResponse,
            { status: 500 }
        );
    }
}