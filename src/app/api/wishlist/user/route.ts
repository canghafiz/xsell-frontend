import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const BE_API = process.env.BE_API;

    if (!BE_API) {
        return NextResponse.json(
            { success: false, code: 500, error: 'Backend API not configured' },
            { status: 500 }
        );
    }

    // 🔐 Read Authorization header
    const authHeader =
        request.headers.get('authorization') ||
        request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json(
            { success: false, code: 401, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // 🔎 Read query params
    const userId = request.nextUrl.searchParams.get('userId');
    const sortBy = request.nextUrl.searchParams.get('sortBy') || '';

    if (!userId) {
        return NextResponse.json(
            { success: false, code: 400, error: 'userId is required' },
            { status: 400 }
        );
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader
        : `Bearer ${authHeader}`;

    const backendUrl = `${BE_API}member/wishlist/user/${userId}${
        sortBy ? `?sortBy=${sortBy}` : ''
    }`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token,
            },
        });

        const rawText = await backendRes.text();

        if (!backendRes.ok) {
            let errorResponse;
            try {
                errorResponse = JSON.parse(rawText);
            } catch {
                errorResponse = {
                    success: false,
                    code: backendRes.status,
                    error: 'Failed to fetch wishlist',
                };
            }

            return NextResponse.json(errorResponse, {
                status: backendRes.status,
            });
        }

        return new NextResponse(rawText, {
            status: backendRes.status,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Wishlist User API error:', error);
        return NextResponse.json(
            { success: false, code: 500, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
