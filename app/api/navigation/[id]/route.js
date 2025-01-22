// app/api/navigation/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const result = await db.query(`
            SELECT 
                r.id,
                r.path,
                r.is_active,
                r.created_at,
                r.updated_at,
                json_object_agg(
                    rt.language::text,
                    rt.title
                ) as translations
            FROM routes r
            LEFT JOIN route_translations rt ON r.id = rt.route_id
            WHERE r.id = $1
            GROUP BY r.id, r.path, r.is_active, r.created_at, r.updated_at
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
        const { path, translations, is_active } = await request.json();

        // ვალიდაცია
        if (!path || !translations?.en || !translations?.ka) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "ყველა სავალდებულო ველი უნდა იყოს შევსებული"
                },
                { status: 400 }
            );
        }

        // First update the route
        const routeResult = await db.query(`
            UPDATE routes 
            SET 
                path = $1,
                is_active = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `, [path, is_active, params.id]);

        if (!routeResult.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `ჩანაწერი ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        // Then update translations
        await db.query(`
            UPDATE route_translations 
            SET title = $1
            WHERE route_id = $2 AND language = 'en'
        `, [translations.en, params.id]);

        await db.query(`
            UPDATE route_translations 
            SET title = $1
            WHERE route_id = $2 AND language = 'ka'
        `, [translations.ka, params.id]);

        // Get updated data
        const result = await db.query(`
            SELECT 
                r.id,
                r.path,
                r.is_active,
                r.created_at,
                r.updated_at,
                json_object_agg(
                    rt.language::text,
                    rt.title
                ) as translations
            FROM routes r
            LEFT JOIN route_translations rt ON r.id = rt.route_id
            WHERE r.id = $1
            GROUP BY r.id, r.path, r.is_active, r.created_at, r.updated_at
        `, [params.id]);

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
            DELETE FROM routes 
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