import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        console.log('Fetching apartments for block:', params.blockId);

        // Accept any blockId format (letter or number)
        const blockId = params.blockId;

        if (!blockId) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Block ID is required"
                },
                { status: 400 }
            );
        }

        // Check the type_id columns first
        const typeCheck = await db.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'apartment_types' AND column_name = 'type_id'
        `);

        console.log('Type ID datatype in apartment_types:', typeCheck);

        const apartmentTypeCheck = await db.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'apartments' AND column_name = 'type_id'
        `);

        console.log('Type ID datatype in apartments:', apartmentTypeCheck);

        // Use a query with explicit text casting on the JOIN condition
        const result = await db.query(`
            SELECT 
                a.apartment_id,
                a.apartment_number,
                a.floor,
                a.status,
                t.total_area,
                t.studio_area,
                t.bedroom_area,
                t.bedroom2_area,
                t.bathroom_area,
                t.bathroom2_area,
                t.living_room_area,
                t.balcony_area,
                t.balcony2_area
            FROM apartments a
            JOIN apartment_types t ON a.type_id::TEXT = t.type_id::TEXT
            WHERE a.block_id LIKE $1
            ORDER BY 
                CAST(floor AS INTEGER),
                apartment_number
        `, [blockId.toString()]);

        const apartments = result?.length ? result : [];

        return NextResponse.json({
            status: "success",
            data: apartments,
            meta: {
                total: apartments.length,
                block: blockId
            }
        });
    } catch (error) {
        console.error('Error fetching apartments:', error);

        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა ბინების მოძიებისას",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}