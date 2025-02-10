import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.query(`
            SELECT * FROM hero_content 
            ORDER BY id ASC
        `);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json([]);
    }
}
export async function POST(request) {
    try {
        const { image_url, title_en, title_ge, description_en, description_ge } = await request.json();

        if (!title_ge || !title_en || !description_ge || !description_en || !image_url) {
            return NextResponse.json(
                { status: "error", message: "ყველა სავალდებულო ველი უნდა იყოს შევსებული" },
                { status: 400 }
            );
        }

        const result = await db.query(`
            INSERT INTO hero_content 
            (image_url, title_en, title_ge, description_en, description_ge)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [image_url, title_en, title_ge, description_en, description_ge]);

        return NextResponse.json({
            status: "success",
            message: "მონაცემები წარმატებით დაემატა"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { status: "error", message: "მონაცემების დამატებისას დაფიქსირდა შეცდომა" },
            { status: 500 }
        );
    }
}