// app/api/contactinfo/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();

        const result = await db.query(
            `INSERT INTO contact (
                address_line_ge,
                address_line_en,
                phone_number,
                email,
                map_url
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                data.address_line_ge,
                data.address_line_en,
                data.phone_number,
                data.email,
                data.map_url
            ]
        );

        return NextResponse.json({
            status: "success",
            message: "კონტაქტის ინფორმაცია წარმატებით დაემატა",
            data: result[0]
        });
    } catch (error) {
        console.error('Error creating contact info:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა კონტაქტის ინფორმაციის დამატებისას",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const result = await db.query(
            `SELECT * FROM contact ORDER BY id DESC LIMIT 1`
        );

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა კონტაქტის ინფორმაციის მოძიებისას"
            },
            { status: 500 }
        );
    }
}