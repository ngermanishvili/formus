// app/api/auth/login/route.js
import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from 'crypto';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
    console.log('---Login Debug Start---');

    try {
        // მოვიღოთ და დავალოგოთ request body
        const body = await request.json();
        console.log('Request body:', { ...body, password: '[HIDDEN]' });

        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { status: "error", message: "შეიყვანეთ მომხმარებელი და პაროლი" },
                { status: 400 }
            );
        }

        console.log('Querying database for user:', username);

        // PostgreSQL-ის სინტაქსით
        const users = await query(
            `SELECT * FROM admin WHERE username = $1 AND is_active = true`,
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

        // პაროლის შემოწმება
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

        // ტოკენის შექმნა
        const token = await new SignJWT({
            userId: user.admin_id,
            username: user.username
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(JWT_SECRET));

        console.log('Generated token:', token.substring(0, 20) + '...');

        // ბოლო შესვლის დროის განახლება PostgreSQL სინტაქსით
        console.log('Updating last login...');
        await query(
            `UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE admin_id = $1`,
            [user.admin_id]
        );

        const response = NextResponse.json({
            status: "success",
            message: "წარმატებული ავტორიზაცია"
        });

        // ქუქის დაყენება
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
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        // დეტალური error მესიჯები დეველოპმენტისთვის
        const errorMessage = process.env.NODE_ENV === 'development'
            ? `სისტემური შეცდომა: ${error.message}`
            : "სისტემური შეცდომა";

        return NextResponse.json(
            { status: "error", message: errorMessage },
            { status: 500 }
        );
    }
}