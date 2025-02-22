// app/api/blog/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.query(`
            SELECT 
                id,
                title_en,
                title_ge,
                description_en,
                description_ge,
                image_url,
                created_at,
                updated_at
            FROM blog_posts 
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
        const {
            title_en,
            title_ge,
            description_en,
            description_ge,
            image_url
        } = await request.json();

        // ვალიდაცია
        if (!title_ge || !description_ge || !title_en || !description_en) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "ყველა სავალდებულო ველი უნდა იყოს შევსებული"
                },
                { status: 400 }
            );
        }

        const result = await db.query(`
            INSERT INTO blog_posts (
                title_en,
                title_ge,
                description_en,
                description_ge,
                image_url
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            title_en,
            title_ge,
            description_en,
            description_ge,
            image_url
        ]);

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