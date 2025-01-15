import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        console.log('Fetching apartments for block:', params.blockId);

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
            JOIN apartment_types t ON a.type_id = t.type_id
            WHERE a.block_id = $1
            ORDER BY 
                CAST(floor AS INTEGER),
                apartment_number
        `, [params.blockId]);

        const apartments = result?.length ? result : [];

        return NextResponse.json({
            status: "success",
            data: apartments,
            meta: {
                total: apartments.length,
                block: params.blockId
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