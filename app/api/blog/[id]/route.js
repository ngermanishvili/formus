// app/api/blog/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const result = await db.query(`
            SELECT * FROM blog_posts 
            WHERE id = $1
        `, [params.id]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `პოსტი ID ${params.id}-ით ვერ მოიძებნა`
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
                message: "პოსტის მოძიებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { title, description, image_url } = await request.json();

        const result = await db.query(`
            UPDATE blog_posts 
            SET title = $1, 
                description = $2, 
                image_url = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `, [title, description, image_url, params.id]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `პოსტი ID ${params.id}-ით ვერ მოიძებნა`
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
                message: "პოსტის განახლებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const result = await db.query(`
            DELETE FROM blog_posts 
            WHERE id = $1
            RETURNING *
        `, [params.id]);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `პოსტი ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "პოსტი წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "პოსტის წაშლისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}