// app/api/buildings/[blockId]/floors/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const floors = await db.query(`
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
            WHERE f.block_id = ?
            ORDER BY f.floor_number DESC
        `, [params.blockId]);

        // გარდავქმნათ მონაცემები შესაბამის ფორმატში
        const formattedFloors = floors.map(floor => ({
            id: floor.floor_id,
            title: floor.title,
            points: floor.polygon_coords,
            status: floor.status,
            price: floor.price || 'თავისუფალი',
            area: floor.area,
            rooms: floor.rooms,
            floor: floor.floor_number.toString()
        }));

        return NextResponse.json({
            status: "success",
            data: formattedFloors
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

// POST მეთოდი ახალი სართულის დასამატებლად
export async function POST(request, { params }) {
    try {
        const data = await request.json();

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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

        return NextResponse.json({
            status: "success",
            message: "სართული წარმატებით დაემატა",
            data: {
                floor_id: result.insertId
            }
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