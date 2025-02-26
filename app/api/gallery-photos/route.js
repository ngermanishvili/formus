import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// ყველა გალერეის ფოტოს წამოღება
export async function GET(request) {
    try {
        // URL-დან პარამეტრების წამოღება (მაგ. კატეგორიის ფილტრაცია)
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category'); // შეიძლება იყოს 'interior' ან 'exterior'

        // SQL მოთხოვნა და პარამეტრები
        let query = `
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
        `;
        let params = [];

        // კატეგორიით ფილტრაცია თუ მითითებულია
        if (category) {
            query += ` WHERE category = $1`;
            params.push(category);
        }

        // სორტირება
        query += ` ORDER BY display_order`;

        console.log("Executing query:", query, "with params:", params);

        const result = await db.query(query, params);
        console.log("Query result:", result);

        return NextResponse.json({
            status: "success",
            data: result
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "გალერეის ფოტოების მოძიებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}

// ახალი გალერეის ფოტოს დამატება
export async function POST(request) {
    try {
        const body = await request.json();

        const {
            title,
            description,
            image_path,
            project_link,
            category,
            display_order,
            is_active
        } = body;

        // ვალიდაცია
        if (!title || !image_path || !project_link || !category) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "სათაური, ფოტოს მისამართი, პროექტის ბმული და კატეგორია სავალდებულოა"
                },
                { status: 400 }
            );
        }

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

        console.log("Inserting photo:", body);

        const result = await db.query(`
            INSERT INTO gallery_photos (
                title,
                description,
                image_path,
                project_link,
                category,
                display_order,
                is_active
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [
            title,
            description || null,
            image_path,
            project_link,
            category,
            display_order || 0,
            is_active !== undefined ? is_active : true
        ]);

        console.log("Insert result:", result);

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "გალერეის ფოტოს დამატებისას დაფიქსირდა შეცდომა"
            },
            { status: 500 }
        );
    }
}