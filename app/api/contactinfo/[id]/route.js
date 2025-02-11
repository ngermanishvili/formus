// app/api/contactinfo/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const id = params.id;
        const result = await db.query(
            'SELECT * FROM contact WHERE id = $1',
            [id]
        );

        if (result.length === 0) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "კონტაქტის ინფორმაცია ვერ მოიძებნა"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "კონტაქტის ინფორმაციის მოძიებისას მოხდა შეცდომა",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const data = await request.json();

        const result = await db.query(
            `UPDATE contact SET 
                address_line_ge = $1,
                address_line_en = $2,
                phone_number = $3,
                email = $4,
                map_url = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6 
            RETURNING *`,
            [
                data.address_line_ge,
                data.address_line_en,
                data.phone_number,
                data.email,
                data.map_url,
                id
            ]
        );

        if (result.length === 0) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "კონტაქტის ინფორმაცია ვერ მოიძებნა"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "კონტაქტის ინფორმაცია წარმატებით განახლდა",
            data: result[0]
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "კონტაქტის ინფორმაციის განახლებისას მოხდა შეცდომა",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = params.id;

        const result = await db.query(
            'DELETE FROM contact WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.length === 0) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "კონტაქტის ინფორმაცია ვერ მოიძებნა"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "კონტაქტის ინფორმაცია წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "კონტაქტის ინფორმაციის წაშლისას მოხდა შეცდომა",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}