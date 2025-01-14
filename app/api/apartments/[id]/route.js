// app/api/apartments/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        // ჯერ ვანახლებთ apartment_types ცხრილს
        await db.query(`
      UPDATE apartment_types t
      JOIN apartments a ON t.type_id = a.type_id
      SET 
        t.total_area = ?,
        t.studio_area = ?,
        t.bedroom_area = ?,
        t.bathroom_area = ?,
        t.living_room_area = ?,
        t.balcony_area = ?
      WHERE a.apartment_id = ?
    `, [
            data.total_area,
            data.studio_area,
            data.bedroom_area,
            data.bathroom_area,
            data.living_room_area,
            data.balcony_area,
            id
        ]);

        // შემდეგ ვანახლებთ apartments ცხრილს
        await db.query(`
      UPDATE apartments
      SET 
        apartment_number = ?,
        floor = ?
      WHERE apartment_id = ?
    `, [data.apartment_number, data.floor, id]);

        return NextResponse.json({
            status: "success",
            message: "Apartment updated successfully"
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