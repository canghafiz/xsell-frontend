import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthApiResponse, LoginPayload } from "@/types/user";

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

    try {
        const payload: LoginPayload = await req.json();

        const res = await fetch(`${BE_API}member/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data: AuthApiResponse = await res.json();

        if (res.ok && data.success && typeof data.data === "string" && data.data) {
            (await cookies()).set({
                name: "login_data",
                value: data.data,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400, // 1 day
                path: "/",
                sameSite: "lax",
            });
        }

        return NextResponse.json(data, { status: data.code || res.status });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Network error";
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