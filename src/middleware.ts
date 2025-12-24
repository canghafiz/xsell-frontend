import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only exact protected paths
const protectedPaths = [
    '/post',
    '/post/attributes',
    '/profile',
    '/profile/edit',
    '/my-ads',
    '/my-favorites',
]

const postFlowPaths = ['/post/attributes']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    /**
     * 🔒 Protected rule:
     * - Exact match
     * - OR nested path AFTER protected root (except /profile/[slug])
     */
    const isProtected = protectedPaths.some(path => {
        if (path === '/profile') {
            // Protect ONLY /profile (exact), not /profile/[slug]
            return pathname === '/profile'
        }

        return pathname === path || pathname.startsWith(`${path}/`)
    })

    if (isProtected) {
        const loginCookie = request.cookies.get('login_data')

        if (!loginCookie) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // 🧭 Post flow validation
        const isPostFlowPath = postFlowPaths.some(path =>
            pathname === path || pathname.startsWith(`${path}/`)
        )

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
