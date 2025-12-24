import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/post', '/post/attributes', '/profile', '/profile/edit', '/my-ads', '/my-favorites']
const postFlowPaths = ['/post/attributes'] // Paths that need post_category cookie

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isProtected = protectedPaths.some(path => pathname.startsWith(path))

    if (isProtected) {
        // Check authentication first
        const loginCookie = request.cookies.get('login_data')

        if (!loginCookie) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Check if user is on post flow paths
        const isPostFlowPath = postFlowPaths.some(path => pathname.startsWith(path))

        if (isPostFlowPath) {
            const postCategoryCookie = request.cookies.get('post_category')

            if (!postCategoryCookie) {
                return NextResponse.redirect(new URL('/post', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}