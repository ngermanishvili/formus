// app/api/sliders/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/sliders/route.js
export async function POST(request) {
    try {
        const data = await request.json();

        const result = await db.query(
            `INSERT INTO landing_sliders (
                title_ge,
                description_ge,
                title_en,
                description_en,
                image_url,
                order_position,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                data.title_ge,
                data.description_ge,
                data.title_en,
                data.description_en,
                data.image_url,
                data.order_position || 1,
                true
            ]
        );

        return NextResponse.json({
            status: "success",
            message: "სლაიდერი წარმატებით დაემატა",
            data: result[0]
        });
    } catch (error) {
        console.error('Error creating slider:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა სლაიდერის დამატებისას",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const result = await db.query(
            `SELECT * FROM landing_sliders WHERE is_active = true ORDER BY order_position`
        );

        return NextResponse.json({
            status: "success",
            data: result
        });
    } catch (error) {
        console.error('Error fetching sliders:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა სლაიდერების მოძიებისას"
            },
            { status: 500 }
        );
    }
}