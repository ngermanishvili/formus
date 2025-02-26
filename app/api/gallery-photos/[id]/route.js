import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// კონკრეტული გალერეის ფოტოს წამოღება
export async function GET(request, { params }) {
    try {
        console.log("Fetching photo with ID:", params.id);

        const result = await db.query(`
            SELECT 
                id,
                title,
                description,
                image_path,
                project_link,
                category,
                display_order,
                is_active
            FROM gallery_photos 
            WHERE id = $1
        `, [params.id]);

        console.log("GET result:", result);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `გალერეის ფოტო ID ${params.id}-ით ვერ მოიძებნა`
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
                message: "გალერეის ფოტოს მოძიებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

// გალერეის ფოტოს განახლება
export async function PUT(request, { params }) {
    try {
        console.log("Updating photo with ID:", params.id);
        const body = await request.json();
        console.log("Update body:", body);

        // ჯერ წამოვიღოთ არსებული მონაცემები
        const currentData = await db.query(`
            SELECT * FROM gallery_photos WHERE id = $1
        `, [params.id]);

        if (!currentData.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `გალერეის ფოტო ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        // შევინარჩუნოთ არსებული მნიშვნელობები თუ ახალი არ მოდის
        const title = body.title ?? currentData[0].title;
        const description = body.description ?? currentData[0].description;
        const image_path = body.image_path ?? currentData[0].image_path;
        const project_link = body.project_link ?? currentData[0].project_link;
        const category = body.category ?? currentData[0].category;
        const display_order = body.display_order ?? currentData[0].display_order;
        const is_active = body.is_active !== undefined ? body.is_active : currentData[0].is_active;

        // კატეგორიის ვალიდაცია
        if (category !== 'interior' && category !== 'exterior') {
            return NextResponse.json(
                {
                    status: "error",
                    message: "კატეგორია უნდა იყოს 'interior' ან 'exterior'"
                },
                { status: 400 }
            );
        }

        console.log("Updating with values:", {
            title, description, image_path, project_link, category, display_order, is_active
        });

        const result = await db.query(`
            UPDATE gallery_photos 
            SET 
                title = $1,
                description = $2,
                image_path = $3,
                project_link = $4,
                category = $5,
                display_order = $6,
                is_active = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
        `, [
            title,
            description,
            image_path,
            project_link,
            category,
            display_order,
            is_active,
            params.id
        ]);

        console.log("Update result:", result);

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "გალერეის ფოტოს განახლებისას დაფიქსირდა შეცდომა: " + error.message
            },
            { status: 500 }
        );
    }
}

// გალერეის ფოტოს წაშლა
export async function DELETE(request, { params }) {
    try {
        console.log("Deleting photo with ID:", params.id);

        const result = await db.query(`
            DELETE FROM gallery_photos 
            WHERE id = $1
            RETURNING *
        `, [params.id]);

        console.log("Delete result:", result);

        if (!result.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `გალერეის ფოტო ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "გალერეის ფოტო წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "გალერეის ფოტოს წაშლისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}   