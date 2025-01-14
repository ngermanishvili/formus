// app/api/buildings/[blockId]/floors/bulk/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const floors = await request.json();

        // ტრანზაქციის გამოყენება ყველა ცვლილების ერთად შესანახად
        await db.transaction(async (trx) => {
            for (const floor of floors) {
                await trx.query(`
                    UPDATE floors
                    SET 
                        polygon_coords = ?,
                        title = ?,
                        status = ?,
                        price = ?,
                        area = ?,
                        rooms = ?
                    WHERE floor_id = ? AND block_id = ?
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
            }
        });

        return NextResponse.json({
            status: "success",
            message: "სართულები წარმატებით განახლდა"
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: error.message
            },
            { status: 500 }
        );
    }
}