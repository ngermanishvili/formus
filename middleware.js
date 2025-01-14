import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// საჯარო API endpoint-ების სია
const PUBLIC_APIS = [
    '/api/buildings',
    '/api/polygons',
    '/api/buildings',
    '/api/test-db',

];

export function middleware(request) {
    const path = request.nextUrl.pathname;
    console.log('Checking path:', path);

    // ვამოწმებთ არის თუ არა მოთხოვნილი path საჯარო
    const isPublicApi = PUBLIC_APIS.some(api => path.startsWith(api));

    // თუ საჯარო API-ია, პირდაპირ ვაძლევთ წვდომას
    if (isPublicApi) {
        console.log('Public API access granted:', path);
        return NextResponse.next();
    }

    // არ ვამოწმებთ auth endpoints
    if (path.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth_token');

    if (path === '/login') {
        if (token) {
            try {
                const verified = jwtVerify(
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

    // ვამოწმებთ admin გვერდებს და დაცულ API-ებს
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
            const verified = jwtVerify(
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
        '/admin/:path*',
        '/api/:path*',
        '/login'
    ]
}