
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// ყველა სოციალური ქსელის წამოღება
export async function GET() {
    try {
        const result = await db.query(`
            SELECT 
                id,
                platform,
                platform_key,
                url,
                is_visible,
                display_order
            FROM social_media_links 
            ORDER BY display_order
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
                message: "სოციალური ქსელების მოძიებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

// ახალი სოციალური ქსელის დამატება
export async function POST(request) {
    try {
        const {
            platform,
            platform_key,
            url,
            is_visible,
            display_order
        } = await request.json();

        // ვალიდაცია
        if (!platform || !platform_key) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "პლატფორმა და platform_key სავალდებულოა"
                },
                { status: 400 }
            );
        }

        const result = await db.query(`
            INSERT INTO social_media_links (
                platform,
                platform_key,
                url,
                is_visible,
                display_order
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            platform,
            platform_key,
            url,
            is_visible || false,
            display_order || 0
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
                message: "სოციალური ქსელის დამატებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}
