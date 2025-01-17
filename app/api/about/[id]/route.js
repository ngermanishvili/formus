// app/api/about/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const result = await db.query(`
            SELECT 
                id,
                title_ge,
                title_en,
                description_ge,
                description_en,
                image_url,
                map_url,
                address_ge,
                address_en,
                phone,
                email,
                order_position,
                is_active,
                created_at,
                updated_at
            FROM about_section 
            WHERE id = $1
        `, [params.id]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `ჩანაწერი ID ${params.id}-ით ვერ მოიძებნა`
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
                message: "მონაცემების მოძიებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const {
            title_ge,
            title_en,
            description_ge,
            description_en,
            image_url,
            map_url,
            address_ge,
            address_en,
            phone,
            email,
            order_position,
            is_active
        } = await request.json();

        // ვალიდაცია
        if (!title_ge || !title_en || !description_ge || !description_en || !image_url) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "ყველა სავალდებულო ველი უნდა იყოს შევსებული"
                },
                { status: 400 }
            );
        }

        const result = await db.query(`
            UPDATE about_section 
            SET 
                title_ge = $1,
                title_en = $2,
                description_ge = $3,
                description_en = $4,
                image_url = $5,
                map_url = $6,
                address_ge = $7,
                address_en = $8,
                phone = $9,
                email = $10,
                order_position = $11,
                is_active = $12,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING *
        `, [
            title_ge,
            title_en,
            description_ge,
            description_en,
            image_url,
            map_url,
            address_ge,
            address_en,
            phone,
            email,
            order_position,
            is_active,
            params.id
        ]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `ჩანაწერი ID ${params.id}-ით ვერ მოიძებნა`
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
                message: "მონაცემების განახლებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const result = await db.query(`
            DELETE FROM about_section 
            WHERE id = $1
            RETURNING *
        `, [params.id]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `ჩანაწერი ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "ჩანაწერი წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "მონაცემების წაშლისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}