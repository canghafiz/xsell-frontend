import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthApiResponse } from "@/types/user";

export async function DELETE() {
    const BE_API = process.env.BE_API;
    if (!BE_API) {
        try {
            (await cookies()).delete("login_data");
        } catch {}
        return NextResponse.json({ success: false }, { status: 400 });
    }

    try {
        const token = (await cookies()).get("login_data")?.value;
        if (!token) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        let email: string | null = null;
        try {
            const payloadBase64 = token.split(".")[1];
            let base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
            const pad = base64.length % 4;
            if (pad) {
                if (pad === 2) base64 += "==";
                else if (pad === 3) base64 += "=";
            }
            const payloadJson = atob(base64);
            const payload = JSON.parse(payloadJson);

            email = payload.data?.email;
        } catch (e) {
            console.warn("Failed to parse JWT for logout:", e);
        }

        if (!email) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        const backendUrl = `${BE_API}member/user/logout?email=${encodeURIComponent(email)}`;
        const res = await fetch(backendUrl, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        (await cookies()).delete("login_data");

        const data: AuthApiResponse = await res.json();
        return NextResponse.json(data, { status: data.code || res.status });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Internal server error";
        console.error("Logout error:", msg);

        try {
            (await cookies()).delete("login_data");
        } catch {}

        return NextResponse.json({ success: false }, { status: 400 });
    }
}