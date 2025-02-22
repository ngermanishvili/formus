import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const PUBLIC_APIS = [
    '/api/buildings',
    '/api/polygons',
    '/api/test-db',
    '/api/projects',
    '/api/sliders',
    '/api/apartments',
    '/api/buildings/floor',
    '/api/navigation',
    '/api/about',
    '/api/blog',
    '/api/projects/3',
    'api/hero-content',
    '/api/contact',
    '/api/social-links',
];

const intlMiddleware = createIntlMiddleware({
    ...routing,
    localePrefix: "always",  // Changed to "always" for consistent behavior
    defaultLocale: 'ka',
    locales: ['ka', 'en']
});

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Handle API and admin routes first
    if (path.startsWith('/api') || path.startsWith('/admin')) {
        // Your existing API and admin middleware logic
        const isPublicApi = PUBLIC_APIS.some(api => path.startsWith(api));
        if (isPublicApi || path.startsWith('/api/auth')) {
            return NextResponse.next();
        }
        // Rest of your auth logic...
        return NextResponse.next();
    }

    // For root path, redirect to default locale
    if (path === '/') {
        return NextResponse.redirect(new URL('/ka', request.url));
    }

    // Prevent double locale prefixing
    const hasLocalePrefix = routing.locales.some(locale =>
        path.startsWith(`/${locale}/${locale}`)
    );

    if (hasLocalePrefix) {
        // Remove double locale prefix
        const segments = path.split('/');
        const correctedPath = `/${segments[1]}/${segments.slice(3).join('/')}`;
        return NextResponse.redirect(new URL(correctedPath, request.url));
    }

    // Use next-intl middleware for all other routes
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/',
        '/((?!api|_next|_vercel|static|favicon|.*\\..*).*)',
        '/admin/:path*',
        '/api/:path*',
        '/login'
    ]
};
