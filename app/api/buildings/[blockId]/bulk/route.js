//app/api/buildings/%5BblockId%5D/bulk/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    console.log('Starting bulk update for block:', params.blockId);

    // ტრანზაქციის დაწყება
    const client = await db.connect();

    try {
        const floors = await request.json();
        console.log(`Updating ${floors.length} floors`);

        await client.query('BEGIN');

        for (const floor of floors) {
            console.log(`Updating floor ID: ${floor.floor_id}`);

            const result = await client.query(`
                UPDATE floors
                SET 
                    polygon_coords = $1,
                    title = $2,
                    status = $3,
                    price = $4,
                    area = $5,
                    rooms = $6
                WHERE floor_id = $7 AND block_id = $8
                RETURNING floor_id
            `, [
                floor.polygon_coords,
                floor.title,
                floor.status,
                floor.price,
                floor.area,
                floor.rooms,
                floor.floor_id,
                params.blockId
            ]);

            // ვამოწმებთ განახლდა თუ არა ჩანაწერი
            if (result.rowCount === 0) {
                throw new Error(`Floor not found or access denied: ${floor.floor_id}`);
            }
        }

        await client.query('COMMIT');
        console.log('Bulk update completed successfully');

        return NextResponse.json({
            status: "success",
            message: "სართულები წარმატებით განახლდა"
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during bulk update:', {
            error: error.message,
            code: error.code,
            detail: error.detail,
            hint: error.hint
        });

        const errorMessage = process.env.NODE_ENV === 'development'
            ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            }
            : 'შეცდომა სართულების განახლებისას';

        return NextResponse.json(
            {
                status: "error",
                message: errorMessage
            },
            { status: 500 }
        );
    } finally {
        client.release();
        console.log('Database client released');
    }
}