// app/api/social-links/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// კონკრეტული სოციალური ქსელის წამოღება
export async function GET(request, { params }) {
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
            WHERE id = $1
        `, [params.id]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `სოციალური ქსელი ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "სოციალური ქსელის მოძიებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

// სოციალური ქსელის განახლება
// app/api/social-links/[id]/route.js - PUT მეთოდში
export async function PUT(request, { params }) {
    try {
        const body = await request.json();

        // ჯერ წამოვიღოთ არსებული მონაცემები
        const currentData = await db.query(`
            SELECT * FROM social_media_links WHERE id = $1
        `, [params.id]);

        if (!currentData.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `სოციალური ქსელი ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        // შევინარჩუნოთ არსებული მნიშვნელობები თუ ახალი არ მოდის
        const display_order = body.display_order ?? currentData[0].display_order;
        const url = body.url ?? currentData[0].url;

        const result = await db.query(`
            UPDATE social_media_links 
            SET 
                url = $1,
                is_visible = $2,
                display_order = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `, [
            url,
            body.is_visible,
            display_order,
            params.id
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
                message: "სოციალური ქსელის განახლებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}
// სოციალური ქსელის წაშლა
export async function DELETE(request, { params }) {
    try {
        const result = await db.query(`
            DELETE FROM social_media_links 
            WHERE id = $1
            RETURNING *
        `, [params.id]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `სოციალური ქსელი ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "სოციალური ქსელი წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "სოციალური ქსელის წაშლისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

