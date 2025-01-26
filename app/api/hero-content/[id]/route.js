import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    let client;
    try {
        client = await db.connect();
        const result = await client.query(`
      SELECT * FROM hero_content WHERE id = $1
    `, [params.id]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { status: "error", message: `ჩანაწერი ID ${params.id}-ით ვერ მოიძებნა` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            data: result.rows[0]
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

export async function PUT(request, { params }) {
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
      UPDATE hero_content 
      SET 
        image_url = $1,
        title_en = $2,
        title_ge = $3,
        description_en = $4,
        description_ge = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [image_url, title_en, title_ge, description_en, description_ge, params.id]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { status: "error", message: `ჩანაწერი ID ${params.id}-ით ვერ მოიძებნა` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { status: "error", message: "მონაცემების განახლებისას დაფიქსირდა შეცდომა" },
            { status: 500 }
        );
    } finally {
        if (client) client.release();
    }
}

export async function DELETE(request, { params }) {
    let client;
    try {
        client = await db.connect();
        const result = await client.query(`
      DELETE FROM hero_content 
      WHERE id = $1
      RETURNING *
    `, [params.id]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { status: "error", message: `ჩანაწერი ID ${params.id}-ით ვერ მოიძებნა` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "ჩანაწერი წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { status: "error", message: "მონაცემების წაშლისას დაფიქსირდა შეცდომა" },
            { status: 500 }
        );
    } finally {
        if (client) client.release();
    }
}