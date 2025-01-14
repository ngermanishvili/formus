import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from 'crypto';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
    console.log('---Login Debug Start---');
    try {
        const body = await request.json();
        console.log('Request body:', body);
        const { username, password } = body;

        console.log('Querying database for user:', username);
        const users = await query(
            `SELECT * FROM admin WHERE username = ? AND is_active = TRUE`,
            [username]
        );
        console.log('Query result length:', users.length);

        if (!users.length) {
            console.log('No user found');
            return NextResponse.json(
                { status: "error", message: "მომხმარებელი ვერ მოიძებნა" },
                { status: 401 }
            );
        }

        const user = users[0];
        console.log('Found user:', { ...user, password: '[HIDDEN]' });

        const hashedPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        console.log('Comparing password hashes...');
        const isValidPassword = user.password === hashedPassword;
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            return NextResponse.json(
                { status: "error", message: "არასწორი პაროლი" },
                { status: 401 }
            );
        }

        // Create token
        const token = await new SignJWT({
            userId: user.admin_id,
            username: user.username
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(JWT_SECRET));

        console.log('Generated token:', token);

        // Update last login
        console.log('Updating last login...');
        await query(
            `UPDATE admin SET last_login = NOW() WHERE admin_id = ?`,
            [user.admin_id]
        );

        const response = NextResponse.json({
            status: "success",
            message: "წარმატებული ავტორიზაცია"
        });

        console.log('Setting cookie...');
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 86400
        });

        console.log('---Login Debug End---');
        return response;

    } catch (error) {
        console.error('Login error details:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json(
            { status: "error", message: "სისტემური შეცდომა" },
            { status: 500 }
        );
    }
}