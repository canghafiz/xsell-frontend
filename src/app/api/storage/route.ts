import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const BE_API = process.env.BE_API;

    if (!BE_API) {
        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: "Server configuration error",
            },
            { status: 500 }
        );
    }

    try {
        // Get FormData from the request
        const formData = await req.formData();

        // Validate if files are present
        const files = formData.getAll("files");
        if (files.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    code: 400,
                    data: "No files provided",
                },
                { status: 400 }
            );
        }

        // Forward FormData to the backend
        const res = await fetch(`${BE_API}storage/uploadFiles`, {
            method: "POST",
            body: formData, // Pass FormData directly
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (error) {
        const msg = error instanceof Error ? error.message : "Network error";
        console.error("Upload files error:", msg);

        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: msg,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const BE_API = process.env.BE_API;

    if (!BE_API) {
        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: "Server configuration error",
            },
            { status: 500 }
        );
    }

    try {
        // Ambil URL dari query parameter
        const { searchParams } = new URL(req.url);
        const fileUrl = searchParams.get("url");

        if (!fileUrl) {
            return NextResponse.json(
                {
                    success: false,
                    code: 400,
                    data: "File URL is required",
                },
                { status: 400 }
            );
        }

        // Forward request ke backend dengan query parameter
        const res = await fetch(`${BE_API}storage/deleteFile?url=${encodeURIComponent(fileUrl)}`, {
            method: "DELETE",
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (error) {
        const msg = error instanceof Error ? error.message : "Network error";
        console.error("Delete file error:", msg);

        return NextResponse.json(
            {
                success: false,
                code: 500,
                data: msg,
            },
            { status: 500 }
        );
    }
}