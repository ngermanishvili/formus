//app/api/buildings/%5BblockId%5D/floors/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    console.log('Fetching floors for block:', params.blockId);
    try {
        const result = await db.query(`
            SELECT 
                f.floor_id,
                f.block_id,
                f.floor_number,
                f.polygon_coords,
                f.title,
                f.status,
                f.price,
                f.area,
                f.rooms
            FROM floors f
            WHERE f.block_id = $1
            ORDER BY f.floor_number::integer DESC
        `, [params.blockId]);

        // Full result logging
        console.log('Database result:', {
            hasResult: !!result,
            resultType: typeof result,
            isArray: Array.isArray(result),
        });

        // Safely get the data array
        const floors = Array.isArray(result) ? result :
            Array.isArray(result?.rows) ? result.rows : [];

        console.log(`Found ${floors.length} floors`);

        // გარდავქმნათ მონაცემები შესაბამის ფორმატში
        const formattedFloors = floors.map(floor => ({
            id: floor.floor_id,
            title: floor.title,
            block_id: params.blockId, // დავრწმუნდეთ რომ block_id სწორად მიეწოდება
            points: floor.polygon_coords,
            status: floor.status,
            price: floor.price || 'თავისუფალი',
            area: floor.area,
            rooms: floor.rooms,
            floor: floor.floor_number.toString()
        }));

        return NextResponse.json({
            status: "success",
            data: formattedFloors,
            meta: {
                total: formattedFloors.length,
                block: params.blockId
            }
        });
    } catch (error) {
        console.error('Error fetching floors:', {
            error: error.message,
            code: error.code,
            detail: error.detail,
            hint: error.hint,
            stack: error.stack
        });

        const errorMessage = process.env.NODE_ENV === 'development'
            ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                stack: error.stack
            }
            : 'შეცდომა სართულების მოძიებისას';

        return NextResponse.json(
            {
                status: "error",
                message: errorMessage
            },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    console.log('Creating new floor for block:', params.blockId);

    try {
        const data = await request.json();
        console.log('Received floor data:', { ...data, polygon_coords: '[HIDDEN]' });

        const result = await db.query(`
            INSERT INTO floors (
                block_id,
                floor_number,
                polygon_coords,
                title,
                status,
                price,
                area,
                rooms
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING floor_id
        `, [
            params.blockId,
            data.floor_number,
            data.polygon_coords,
            data.title,
            data.status || 'თავისუფალი',
            data.price,
            data.area,
            data.rooms
        ]);

        const newFloorId = Array.isArray(result?.rows) ? result.rows[0]?.floor_id : null;

        if (!newFloorId) {
            throw new Error('Failed to get new floor ID');
        }

        console.log('Created new floor with ID:', newFloorId);

        return NextResponse.json({
            status: "success",
            message: "სართული წარმატებით დაემატა",
            data: {
                floor_id: newFloorId
            }
        });
    } catch (error) {
        console.error('Error creating floor:', {
            error: error.message,
            code: error.code,
            detail: error.detail,
            hint: error.hint,
            stack: error.stack
        });

        const errorMessage = process.env.NODE_ENV === 'development'
            ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                stack: error.stack
            }
            : 'შეცდომა სართულის დამატებისას';

        return NextResponse.json(
            {
                status: "error",
                message: errorMessage
            },
            { status: 500 }
        );
    }
}