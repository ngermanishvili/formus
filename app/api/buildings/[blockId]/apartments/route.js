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

        // დეტალური ლოგირება მთლიანი result ობიექტის
        console.log('Full result object:', JSON.stringify(result));

        // შევამოწმოთ result ობიექტი და მისი თვისებები
        const apartments = result?.length ? result : [];

        console.log(`Found ${apartments.length} apartments for block ${params.blockId}`);

        if (apartments.length > 0) {
            console.log('Sample apartment data:', JSON.stringify(apartments[0]));
        }

        return NextResponse.json({
            status: "success",
            data: apartments,
            meta: {
                total: apartments.length,
                block: params.blockId
            }
        });
    } catch (error) {
        console.error('Error fetching apartments:', {
            error: error.message,
            code: error.code,
            detail: error.detail,
            hint: error.hint,
            position: error.position,
            stack: error.stack
        });

        const errorMessage = process.env.NODE_ENV === 'development'
            ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                position: error.position,
                stack: error.stack
            }
            : 'შეცდომა ბინების მოძიებისას';

        return NextResponse.json(
            {
                status: "error",
                message: errorMessage
            },
            { status: 500 }
        );
    }
}