import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/types/user";

function base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) {
        if (pad === 2) base64 += "==";
        else if (pad === 3) base64 += "=";
    }
    return atob(base64);
}

export async function GET() {
    const token = (await cookies()).get("login_data")?.value;

    if (!token) {
        return NextResponse.json({ user: null });
    }

    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
        }

        const payloadJson = base64UrlDecode(parts[1]);
        const payload = JSON.parse(payloadJson);

        const user: User = {
            user_id: payload.data.user_id,
            email: payload.data.email,
            role: payload.data.role,
            first_name: payload.data.first_name,
            last_name: payload.data.last_name,
            photo_profile: payload.data.photo_profile,
            created_at: payload.data.created_at,
        };

        return NextResponse.json({ user });
    } catch (e) {
        console.error("Failed to parse JWT:", e);
        return NextResponse.json({ user: null });
    }
}