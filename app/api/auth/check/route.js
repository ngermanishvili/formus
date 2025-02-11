import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request) {
    try {
        const token = request.cookies.get('auth_token');

        if (!token) {
            return NextResponse.json(
                { status: "error", message: "No token found" },
                { status: 401 }
            );
        }

        await jwtVerify(
            token.value,
            new TextEncoder().encode(JWT_SECRET)
        );

        return NextResponse.json({
            status: "success",
            message: "Token is valid"
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            { status: "error", message: "Invalid token" },
            { status: 401 }
        );
    }
}