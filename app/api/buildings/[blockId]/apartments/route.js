// app/api/buildings/[blockId]/apartments/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const apartments = await db.query(`
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
      WHERE a.block_id = ?
      ORDER BY a.floor, a.apartment_number
    `, [params.blockId]);

        return NextResponse.json({
            status: "success",
            data: apartments
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