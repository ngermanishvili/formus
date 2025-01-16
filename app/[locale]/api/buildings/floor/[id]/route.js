// app/api/buildings/floor/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        console.log('1. API Request started, floor ID:', params.id);

        if (!params.id || params.id === 'undefined') {
            throw new Error('Invalid floor ID');
        }

        // პირველი query - floor ინფორმაცია
        console.log('2. Executing floor query...');
        const floorResult = await db.query(`
            SELECT 
                f.floor_id,
                f.block_id,
                f.floor_number,
                f.polygon_coords,
                f.title,
                f.status,
                f.price,
                f.area,
                f.rooms,
                f.floor_plan_url
            FROM floors f
            WHERE f.floor_id = $1
        `, [params.id]);

        console.log('3. Floor query result:', {
            hasResults: floorResult.length > 0,
            resultData: floorResult
        });

        if (!floorResult.length) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `სართული ID ${params.id}-ით ვერ მოიძებნა`
                },
                { status: 404 }
            );
        }

        const floorData = floorResult[0];
        console.log('4. Floor data:', floorData);

        // მეორე query - apartments ინფორმაცია
        console.log('5. Executing apartments query with:', {
            block_id: floorData.block_id,
            floor_number: floorData.floor_number
        });

        const apartmentsResult = await db.query(`
            SELECT 
                a.apartment_id,
                a.apartment_number,
                a.floor,
                a.status,
                a.polygon_coords,
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
            WHERE a.block_id = $1 AND a.floor = $2
            ORDER BY a.apartment_number
        `, [floorData.block_id, floorData.floor_number]);

        console.log('6. Apartments query result:', {
            count: apartmentsResult.length,
            firstApartment: apartmentsResult[0]
        });

        return NextResponse.json({
            status: "success",
            data: {
                floor: floorData,
                apartments: apartmentsResult
            }
        });

    } catch (error) {
        console.error('API Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            detail: error.detail
        });

        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა სართულის მოძიებისას",
                detail: process.env.NODE_ENV === 'development' ? {
                    message: error.message,
                    code: error.code,
                    detail: error.detail
                } : undefined
            },
            { status: 500 }
        );
    }
}