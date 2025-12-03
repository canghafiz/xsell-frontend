import { NextResponse } from "next/server";
import {AuthApiResponse, VerifyEmailPayload} from "@/types/user";

export async function POST(req: Request) {
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

    const payload: VerifyEmailPayload = await req.json();

    try {
        const res = await fetch(`${BE_API}member/otp/verifyEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data: AuthApiResponse = await res.json();

        return NextResponse.json(data, { status: data.code });
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
