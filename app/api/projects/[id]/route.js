// app/api/projects/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.query(`SELECT * FROM projects ORDER BY created_at DESC`);
        console.log('Query Result:', result);  // ნახავთ რომ მონაცემები rows მასივშია

        // მთავარი ცვლილება - result.rows გამოყენება
        return NextResponse.json({
            status: "success",
            data: result.rows
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "პროექტების მოძიებისას დაფიქსირდა შეცდომა"
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
            main_image_url,
            location_en,
            location_ge,
            features_en,
            features_ge
        } = await request.json();

        // ვალიდაცია
        if (!title_ge || !description_ge || !title_en || !description_en || !main_image_url) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "ყველა სავალდებულო ველი უნდა იყოს შევსებული"
                },
                { status: 400 }
            );
        }

        const result = await db.query(`
            INSERT INTO projects (
                title_en,
                title_ge,
                description_en,
                description_ge,
                main_image_url,
                location_en,
                location_ge,
                features_en,
                features_ge
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [
            title_en,
            title_ge,
            description_en,
            description_ge,
            main_image_url,
            location_en,
            location_ge,
            features_en,
            features_ge
        ]);

        // აქაც result.rows[0] უნდა გამოვიყენოთ
        return NextResponse.json({
            status: "success",
            data: result.rows[0]
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "პროექტის დამატებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}