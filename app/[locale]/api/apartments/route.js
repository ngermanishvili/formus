// app/api/apartments/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Received data:", data);

        // ჩავსვათ apartment type და დავაბრუნოთ მისი ID
        const typeResult = await db.query(
            `INSERT INTO apartment_types (
                total_area,
                studio_area,
                bedroom_area,
                bedroom2_area,
                bathroom_area,
                bathroom2_area,
                living_room_area,
                balcony_area,
                balcony2_area
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING type_id`,
            [
                parseFloat(data.total_area) || 0,
                parseFloat(data.studio_area) || 0,
                parseFloat(data.bedroom_area) || 0,
                parseFloat(data.bedroom2_area) || 0,
                parseFloat(data.bathroom_area) || 0,
                parseFloat(data.bathroom2_area) || 0,
                parseFloat(data.living_room_area) || 0,
                parseFloat(data.balcony_area) || 0,
                parseFloat(data.balcony2_area) || 0
            ]
        );

        console.log("Type creation result:", typeResult);

        const typeId = typeResult[0]?.type_id;
        console.log("Created type with ID:", typeId);

        if (!typeId) {
            throw new Error("Failed to create apartment type");
        }

        // ჩავსვათ apartment და დავაბრუნოთ მისი ID
        const apartmentResult = await db.query(
            `INSERT INTO apartments (
                block_id,
                apartment_number,
                floor,
                type_id,
                status
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING apartment_id`,
            [
                data.block_id,
                data.apartment_number.toString(), // PostgreSQL-ში apartment_number არის varchar
                parseInt(data.floor),
                typeId,
                'available'
            ]
        );

        console.log("Apartment creation result:", apartmentResult);

        const apartmentId = apartmentResult[0]?.apartment_id;
        console.log("Created apartment with ID:", apartmentId);

        if (!apartmentId) {
            // თუ apartment-ის შექმნა ვერ მოხერხდა, წავშალოთ ახლახანს შექმნილი type
            await db.query('DELETE FROM apartment_types WHERE type_id = $1', [typeId]);
            throw new Error("Failed to create apartment");
        }

        // წამოვიღოთ სრული ინფორმაცია ახალ ბინაზე
        const newApartment = await db.query(`
            SELECT 
                a.*,
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
            WHERE a.apartment_id = $1
        `, [apartmentId]);

        // დავაბრუნოთ წარმატებული პასუხი
        return NextResponse.json({
            status: "success",
            message: "ბინა წარმატებით დაემატა",
            data: {
                apartment_id: apartmentId,
                type_id: typeId,
                details: newApartment[0]
            }
        });

    } catch (error) {
        console.error("Error creating apartment:", {
            message: error.message,
            code: error.code,
            detail: error.detail,
            hint: error.hint
        });

        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა ბინის დამატებისას",
                details: process.env.NODE_ENV === 'development' ? {
                    message: error.message,
                    code: error.code,
                    detail: error.detail,
                    hint: error.hint
                } : undefined
            },
            { status: 500 }
        );
    }
}