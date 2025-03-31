import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const isActive = url.searchParams.get('isActive');

        let query = `
           SELECT * FROM projects 
        `;

        if (isActive === 'true') {
            query += ` WHERE is_active = true `;
        }

        query += ` ORDER BY COALESCE(display_order, 999), created_at DESC`;

        const result = await db.query(query);

        return NextResponse.json({
            status: "success",
            data: result
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
            features_ge,
            second_section_img,
            second_section_title_en,
            second_section_title_ge,
            second_section_description_en,
            second_section_description_ge,
            display_order,
            is_active
        } = await request.json();

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
               features_ge,
               second_section_img,
               second_section_title_en,
               second_section_title_ge,
               second_section_description_en,
               second_section_description_ge,
               display_order,
               is_active
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
            features_ge,
            second_section_img,
            second_section_title_en,
            second_section_title_ge,
            second_section_description_en,
            second_section_description_ge,
            display_order || null,
            is_active || false
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
                message: "პროექტის დამატებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}