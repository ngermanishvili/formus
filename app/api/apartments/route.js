// app/api/apartments/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Received data:", data);

        // Insert apartment type
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

        // Get the last inserted ID
        const [lastTypeIdResult] = await db.query('SELECT LAST_INSERT_ID() as id');
        const typeId = lastTypeIdResult.id;

        console.log("Created type with ID:", typeId);

        if (!typeId) {
            throw new Error("Failed to create apartment type");
        }

        // Insert apartment
        const apartmentResult = await db.query(
            `INSERT INTO apartments (
                block_id,
                apartment_number,
                floor,
                type_id,
                status
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                data.block_id,
                parseInt(data.apartment_number),
                parseInt(data.floor),
                typeId,
                'available'
            ]
        );

        console.log("Apartment creation result:", apartmentResult);

        // Get the last inserted ID
        const [lastApartmentIdResult] = await db.query('SELECT LAST_INSERT_ID() as id');
        const apartmentId = lastApartmentIdResult.id;

        console.log("Created apartment with ID:", apartmentId);

        if (!apartmentId) {
            // If apartment creation failed, delete the type we just created
            await db.query('DELETE FROM apartment_types WHERE type_id = ?', [typeId]);
            throw new Error("Failed to create apartment");
        }

        // Return success response
        return NextResponse.json({
            status: "success",
            message: "ბინა წარმატებით დაემატა",
            data: {
                apartment_id: apartmentId,
                type_id: typeId
            }
        });
    } catch (error) {
        console.error("Error creating apartment:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        return NextResponse.json(
            {
                status: "error",
                message: error.message,
                details: {
                    name: error.name,
                    stack: error.stack
                }
            },
            { status: 500 }
        );
    }
}