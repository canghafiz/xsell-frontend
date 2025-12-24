import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/types/user";

/* =========================
   Base64 URL Decode Helper
========================= */
function base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;

    if (pad === 2) base64 += "==";
    else if (pad === 3) base64 += "=";

    return atob(base64);
}

/* =========================
   GET /api/auth/me
========================= */
export async function GET() {
    const BE_API = process.env.BE_API;

    // 🍪 Read cookie (NOT httpOnly as requested)
    const token = (await cookies()).get("login_data")?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        /* =========================
           1️⃣ Decode JWT
        ========================= */
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
        }

        const payloadJson = base64UrlDecode(parts[1]);
        const payload = JSON.parse(payloadJson);

        if (!payload?.data?.user_id) {
            throw new Error("user_id not found in token");
        }

        /* =========================
           2️⃣ Base User From JWT
        ========================= */
        let user: User = {
            user_id: payload.data.user_id,
            email: payload.data.email,
            role: payload.data.role,
            first_name: payload.data.first_name,
            last_name: payload.data.last_name ?? null,
            photo_profile: payload.data.photo_profile ?? null,
            created_at: payload.data.created_at,
        };

        /* =========================
           3️⃣ Enrich User From BE API
        ========================= */
        if (BE_API) {
            const baseUrl = BE_API.endsWith("/")
                ? BE_API
                : `${BE_API}/`;

            const res = await fetch(
                `${baseUrl}user/${user.user_id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                }
            );

            if (res.ok) {
                const json = await res.json();

                // 🔥 Normalize BE response
                const data = json.data ?? json.user ?? json;

                user = {
                    ...user,
                    email: data.email ?? user.email,
                    role: data.role ?? user.role,
                    first_name: data.first_name ?? user.first_name,
                    last_name: data.last_name ?? user.last_name,
                    photo_profile:
                        data.photo_profile ??
                        data.photo_profile_url ??
                        user.photo_profile,
                    created_at: data.created_at ?? user.created_at,
                };
            }
        }

        /* =========================
           4️⃣ Final Response
        ========================= */
        return NextResponse.json({ user });
    } catch (error) {
        console.error("❌ /api/auth/me error:", error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
