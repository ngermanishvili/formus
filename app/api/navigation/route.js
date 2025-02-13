// app/api/navigation/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/navigation/route.js
export async function GET() {
    try {
        console.log('API request received');

        // შევცვალოთ SQL query, რომ გამოვრიცხოთ ID 7 და 8
        const routes = await db.query(`
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
            WHERE r.id NOT IN (7, 8)  -- დავამატეთ ეს პირობა
            GROUP BY r.id, r.path, r.is_active, r.created_at, r.updated_at
            ORDER BY r.id ASC
        `);

        return NextResponse.json({
            status: "success",
            data: routes
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



export async function POST(request) {
    try {
        const { path, translations } = await request.json();

        // დავლოგოთ მოთხოვნის მონაცემები
        console.log('Attempting to create route with path:', path);

        // შევამოწმოთ არსებული ჩანაწერი უფრო დეტალურად
        const existingRoute = await db.query(
            'SELECT id, path, is_active FROM routes WHERE path = $1',
            [path]
        );

        console.log('Existing route check result:', existingRoute);

        if (existingRoute.length > 0) {
            console.log('Found existing route:', existingRoute[0]);
            return NextResponse.json(
                {
                    status: "error",
                    message: `გზა (${path}) უკვე არსებობს სისტემაში`
                },
                { status: 409 }
            );
        }

        // თუ აქამდე მოვედით, ჩანაწერი არ არსებობს და შეგვიძლია დავამატოთ
        const result = await db.query(`
            SELECT * FROM add_route($1, $2, $3)
        `, [path, translations.en, translations.ka]);

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        console.error('API Error:', error);

        // დეტალური შეცდომის შემოწმება
        if (error.code === '23505') {
            return NextResponse.json(
                {
                    status: "error",
                    message: "ასეთი გზა (path) უკვე არსებობს"
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                status: "error",
                message: "მონაცემების დამატებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}