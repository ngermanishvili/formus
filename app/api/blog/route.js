// app/api/blog/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.query(`
            SELECT * FROM blog_posts 
            ORDER BY created_at DESC
        `);

        return NextResponse.json({
            status: "success",
            data: result
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "ბლოგის პოსტების მოძიებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { title, description, image_url } = await request.json();

        const result = await db.query(`
            INSERT INTO blog_posts (title, description, image_url)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [title, description, image_url]);

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "პოსტის დამატებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}