// app/api/apartments/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Received data:", data);

        const typeResult = await db.query(
            `INSERT INTO apartment_types (
                total_area,
                studio_area,
                bedroom_area,
                bedroom2_area,
                bedroom3_area,
                bathroom_area,
                bathroom2_area,
                living_room_area,
                balcony_area,
                balcony2_area,
                polygon_coords,
                type_name,
                room_details
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                $11, $12, $13
            )
            RETURNING type_id`,
            [
                parseFloat(data.total_area) || 0,
                parseFloat(data.studio_area) || null,
                parseFloat(data.bedroom_area) || null,
                parseFloat(data.bedroom2_area) || null,
                null, // bedroom3_area
                parseFloat(data.bathroom_area) || null,
                parseFloat(data.bathroom2_area) || null,
                parseFloat(data.living_room_area) || null,
                parseFloat(data.balcony_area) || null,
                parseFloat(data.balcony2_area) || null,
                null, // polygon_coords
                null, // type_name
                null  // room_details
            ]
        );

        console.log("Type creation result:", typeResult);

        // შევცვალეთ typeId-ის მიღების ლოგიკა
        const typeId = typeResult[0]?.type_id;
        console.log("Created type with ID:", typeId);

        if (!typeId) {
            throw new Error("Failed to create apartment type");
        }

        // In your POST route handler
        const apartmentResult = await db.query(
            `INSERT INTO apartments (
      block_id,
      apartment_number,
      floor,
      type_id,
      status,
      home_2d,
      home_3d
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING apartment_id`,
            [
                data.block_id,
                data.apartment_number.toString(),
                parseInt(data.floor),
                typeId,
                data.status || 'available',
                data.home_2d || null,
                data.home_3d || null
            ]
        );

        console.log("Apartment creation result:", apartmentResult);

        // შევცვალეთ apartmentId-ის მიღების ლოგიკაც
        const apartmentId = apartmentResult[0]?.apartment_id;
        console.log("Created apartment with ID:", apartmentId);

        if (!apartmentId) {
            await db.query('DELETE FROM apartment_types WHERE type_id = $1', [typeId]);
            throw new Error("Failed to create apartment");
        }

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
        console.error("Error creating apartment:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა ბინის დამატებისას",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const result = await db.query(`
        SELECT 
          a.apartment_id,
          a.block_id,
          a.floor,
          a.status,
          a.price,
          a.home_2d,
          a.home_3d,
          t.total_area
        FROM apartments a
        JOIN apartment_types t ON a.type_id = t.type_id
        ORDER BY a.apartment_number
      `);

        return NextResponse.json(
            { status: "success", data: result },
            {
                headers: {
                    "Cache-Control": "public, max-age=300, s-maxage=600",
                    "CDN-Cache-Control": "public, s-maxage=600",
                    "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
                }
            }
        );
    } catch (error) {
        console.error('Error fetching apartments:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა ბინების მოძიებისას",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}