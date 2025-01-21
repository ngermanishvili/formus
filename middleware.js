import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const PUBLIC_APIS = [
    '/api/buildings',
    '/api/polygons',
    '/api/buildings',
    '/api/test-db',
    '/api/projects',
    '/api/sliders',
    '/api/apartments',
    '/api/buildings/floor',
];

const intlMiddleware = createIntlMiddleware({
    ...routing,
    localePrefix: "never",
    defaultLocale: 'ka'
});

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    console.log('Checking path:', path);

    const hasLocalePrefix = routing.locales.some(locale =>
        path.startsWith(`/${locale}/`) || path === `/${locale}`
    );

    if (!path.startsWith('/api') && !path.startsWith('/admin')) {
        if (hasLocalePrefix) {
            return NextResponse.next();
        }
        return intlMiddleware(request);
    }

    const isPublicApi = PUBLIC_APIS.some(api => path.startsWith(api));

    if (isPublicApi) {
        console.log('Public API access granted:', path);
        return NextResponse.next();
    }

    if (path.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth_token');

    if (path === '/login') {
        if (token) {
            try {
                await jwtVerify(
                    token.value,
                    new TextEncoder().encode(JWT_SECRET)
                );
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } catch (error) {
                const response = NextResponse.next();
                response.cookies.delete('auth_token');
                return response;
            }
        }
        return NextResponse.next();
    }

    if (path.startsWith('/admin') ||
        (path.startsWith('/api/') && !isPublicApi)) {

        if (!token) {
            if (path.startsWith('/api/')) {
                return NextResponse.json(
                    { error: "არაავტორიზებული წვდომა" },
                    { status: 401 }
                );
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await jwtVerify(
                token.value,
                new TextEncoder().encode(JWT_SECRET)
            );
            return NextResponse.next();
        } catch (error) {
            if (path.startsWith('/api/')) {
                return NextResponse.json(
                    { error: "არასწორი ან ვადაგასული ტოკენი" },
                    { status: 401 }
                );
            }
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/((?!api|_next|_vercel|.*\\..*).*)',
        '/admin/:path*',
        '/api/:path*',
        '/login'
    ]
};