import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/product/create', '/product/edit', '/profile']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isProtected = protectedPaths.some(path => pathname.startsWith(path))

    if (isProtected) {
        const cookie = request.cookies.get('login_data')

        if (!cookie) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}