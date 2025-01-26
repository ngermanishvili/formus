import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    let client;
    try {
        client = await db.connect();
        const result = await client.query(`
      SELECT * FROM hero_content 
      ORDER BY id ASC
    `);

        return NextResponse.json({
            status: "success",
            data: result.rows
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { status: "error", message: "მონაცემების მოძიებისას დაფიქსირდა შეცდომა" },
            { status: 500 }
        );
    } finally {
        if (client) client.release();
    }
}

export async function POST(request) {
    let client;
    try {
        const { image_url, title_en, title_ge, description_en, description_ge } = await request.json();

        if (!title_ge || !title_en || !description_ge || !description_en || !image_url) {
            return NextResponse.json(
                { status: "error", message: "ყველა სავალდებულო ველი უნდა იყოს შევსებული" },
                { status: 400 }
            );
        }

        client = await db.connect();
        const result = await client.query(`
      INSERT INTO hero_content 
        (image_url, title_en, title_ge, description_en, description_ge)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [image_url, title_en, title_ge, description_en, description_ge]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { status: "error", message: "ჩანაწერის შექმნა ვერ მოხერხდა" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            status: "success",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { status: "error", message: "მონაცემების დამატებისას დაფიქსირდა შეცდომა" },
            { status: 500 }
        );
    } finally {
        if (client) client.release();
    }
}