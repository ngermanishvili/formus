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

        // Get the type ID
        const typeId = typeResult[0]?.type_id;
        console.log("Created type with ID:", typeId);

        if (!typeId) {
            throw new Error("Failed to create apartment type");
        }

        // Insert apartment without project_id 
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

        const apartmentId = apartmentResult[0]?.apartment_id;
        console.log("Created apartment with ID:", apartmentId);

        if (!apartmentId) {
            await db.query('DELETE FROM apartment_types WHERE type_id = $1', [typeId]);
            throw new Error("Failed to create apartment");
        }

        // Select the newly created apartment
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
                t.balcony2_area,
                p.id as project_id,
                p.title_ge as project_name,
                bb.block_name
            FROM apartments a
            JOIN apartment_types t ON a.type_id = t.type_id
            JOIN building_blocks bb ON a.block_id = bb.block_id
            JOIN project_blocks pb ON a.block_id = pb.block_id
            JOIN projects p ON pb.project_id = p.id
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

export async function GET(request) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);

        // Support both 'project_id' and 'projects' parameters for backward compatibility
        const project_id = searchParams.get('project_id') || searchParams.get('projects');
        const statuses = searchParams.get('statuses')?.split(',') || [];
        const totalAreaMin = Number(searchParams.get('totalAreaMin')) || 0;
        const totalAreaMax = Number(searchParams.get('totalAreaMax')) || Infinity;

        console.log("API Request with simple params:", {
            project_id,
            statuses,
            totalAreaMin,
            totalAreaMax
        });

        // Get apartments with their type info only - avoiding problematic joins
        let query = `
            SELECT 
                a.apartment_id, 
                a.block_id,
                a.apartment_number,
                a.floor,
                a.status,
                a.home_2d,
                a.home_3d,
                t.total_area
            FROM apartments a
            JOIN apartment_types t ON a.type_id::integer = t.type_id
            WHERE 1=1
        `;

        const queryParams = [];

        // Add status filter if provided
        if (statuses.length > 0) {
            const statusPlaceholders = statuses.map((_, idx) => `$${idx + 1}`).join(',');
            query += ` AND a.status IN (${statusPlaceholders})`;
            queryParams.push(...statuses);
        }

        // Add area filters if provided
        if (totalAreaMin > 0) {
            query += ` AND t.total_area::numeric >= $${queryParams.length + 1}`;
            queryParams.push(totalAreaMin);
        }

        if (totalAreaMax < Infinity) {
            query += ` AND t.total_area::numeric <= $${queryParams.length + 1}`;
            queryParams.push(totalAreaMax);
        }

        console.log("Executing minimal SQL query:", query);
        console.log("Parameters:", queryParams);

        const apartments = await db.query(query, queryParams);
        console.log(`Found ${apartments.length} apartments in minimal query`);

        // Now get building block info separately to avoid join problems
        const blockIds = [...new Set(apartments.map(apt => apt.block_id))];

        let blockInfoQuery = `
            SELECT block_id, block_name
            FROM building_blocks
            WHERE block_id = ANY($1::text[])
        `;

        const blockInfo = await db.query(blockInfoQuery, [blockIds]);

        // Create a map of block_id to block_name
        const blockMap = {};
        blockInfo.forEach(block => {
            blockMap[block.block_id] = block.block_name;
        });

        // Process results to add block names
        const processedResults = apartments.map(apt => ({
            ...apt,
            project_id: project_id || "1",  // Use requested project_id or default to 1
            project_name: "Ortachala Hills",
            block_name: blockMap[apt.block_id] || apt.block_id // Use block_name from map or fallback to block_id
        }));

        return NextResponse.json(
            {
                status: "success",
                data: processedResults
            },
            {
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
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

export async function DELETE(request) {
    try {
        // Assuming the ID is passed as a query parameter
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ status: "error", message: "Apartment ID is required" }, { status: 400 });
        }

        // First, delete the apartment
        const result = await db.query(
            'DELETE FROM apartments WHERE apartment_id = $1',
            [id]
        );

        // Then delete from apartment_types
        await db.query(`
        DELETE FROM apartment_types
        WHERE type_id IN (
          SELECT type_id
          FROM apartments
          WHERE apartment_id = $1
        )
      `, [id]);


        return NextResponse.json({ status: "success", message: "Apartment deleted" });
    } catch (error) {
        console.error('Error deleting apartment:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to delete apartment", details: error.message },
            { status: 500 }
        );
    }
}