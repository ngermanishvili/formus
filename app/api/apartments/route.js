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
                '1' as project_id,
                'ორთაჭალა ჰილსი' as project_name,
                bb.block_name
            FROM apartments a
            JOIN apartment_types t ON a.type_id = t.type_id
            JOIN building_blocks bb ON a.block_id = bb.block_id
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

        const project_id = searchParams.get('project_id');
        const blocks = searchParams.get('blocks')?.split(',') || [];
        const floors = searchParams.get('floors')?.split(',').map(Number) || [];
        const statuses = searchParams.get('statuses')?.split(',') || [];
        const totalAreaMin = Number(searchParams.get('totalAreaMin')) || 0;
        const totalAreaMax = Number(searchParams.get('totalAreaMax')) || Infinity;

        console.log("API Request with params:", {
            project_id,
            blocks,
            floors,
            statuses,
            totalAreaMin,
            totalAreaMax
        });

        // Build the query
        let query = `
            SELECT 
                a.apartment_id,
                a.block_id,
                a.apartment_number,
                a.floor,
                a.status,
                a.price,
                a.home_2d,
                a.home_3d,
                t.total_area,
                bb.block_name,
                p.id as project_id,
                p.title_ge as project_name
            FROM apartments a
            JOIN apartment_types t ON a.type_id = t.type_id
            JOIN building_blocks bb ON a.block_id = bb.block_id
            LEFT JOIN project_blocks pb ON a.block_id = pb.block_id
            LEFT JOIN projects p ON pb.project_id = p.id
        `;

        // Add where conditions
        const whereConditions = [];
        let paramIndex = 1;
        const queryParams = [];

        // Add project filter if provided
        if (project_id) {
            whereConditions.push(`p.id = $${paramIndex++}`);
            queryParams.push(project_id);
            console.log(`Filtering apartments by project_id: ${project_id}`);
        }

        // Add block filter if provided - block_id is a character like 'A', 'B', 'D'
        if (blocks.length > 0) {
            // Debug specifically for D block
            if (blocks.includes('D')) {
                console.log("D block is in the requested blocks, checking database data type for block_id");

                // Add a separate debug query to see what D block data looks like in the database
                try {
                    const debugResult = await db.query("SELECT apartment_id, block_id, apartment_number FROM apartments WHERE UPPER(block_id) = 'D' LIMIT 5");
                    console.log(`Found ${debugResult.length} apartments with block_id 'D':`, debugResult);

                    // If no results, try a broader search to see format issues
                    if (debugResult.length === 0) {
                        const allBlocksDebug = await db.query("SELECT DISTINCT block_id FROM apartments");
                        console.log("All distinct block_ids in database:", allBlocksDebug);
                    }
                } catch (dbError) {
                    console.error("Error in debug query for D block:", dbError);
                }
            }

            whereConditions.push(`UPPER(a.block_id) IN (${blocks.map(() => `$${paramIndex++}`).join(',')})`);
            queryParams.push(...blocks);
            console.log(`Filtering apartments by blocks:`, blocks);
        }

        // Add floor filter if provided
        if (floors.length > 0) {
            whereConditions.push(`a.floor IN (${floors.map(() => `$${paramIndex++}`).join(',')})`);
            queryParams.push(...floors);
            console.log(`Filtering apartments by floors:`, floors);
        }

        // Add status filter if provided
        if (statuses.length > 0) {
            // Use case insensitive comparison for status
            whereConditions.push(`LOWER(a.status) IN (${statuses.map(() => `LOWER($${paramIndex++})`).join(',')})`);
            queryParams.push(...statuses);
            console.log(`Filtering apartments by statuses:`, statuses);
        }

        // Combine all WHERE conditions
        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }

        query += ' ORDER BY a.apartment_number';
        console.log("Executing SQL query:", query);
        console.log("Query parameters:", queryParams);

        // Execute query with or without parameters
        let result = queryParams.length > 0
            ? await db.query(query, queryParams)
            : await db.query(query);

        console.log(`Found ${result.length} apartments`);

        if (result.length > 0) {
            // Log the first apartment to see its structure
            console.log("Sample apartment:", {
                id: result[0].apartment_id,
                block_id: result[0].block_id,
                block_name: result[0].block_name,
                floor: result[0].floor,
                status: result[0].status
            });

            // Log unique blocks found
            const uniqueBlocks = [...new Set(result.map(apt => apt.block_id))];
            console.log("Unique block_ids in results:", uniqueBlocks);

            // Check if D block is missing
            if (blocks.includes('D') && !uniqueBlocks.includes('D')) {
                console.log("D block was requested but not found in results. Trying a direct query...");

                // Log the SQL and parameters to see exactly what we're sending to the database
                console.log("Original SQL that didn't return D block:", query);
                console.log("Parameters used:", queryParams);

                // Try a direct query for D block apartments
                const dBlockQuery = `
                SELECT 
                  a.apartment_id,
                  a.block_id,
                  a.apartment_number,
                  a.floor,
                  a.status,
                  a.price,
                  a.home_2d,
                  a.home_3d,
                  t.total_area,
                  bb.block_name,
                  '1' as project_id,
                  'ორთაჭალა ჰილსი' as project_name
                FROM apartments a
                JOIN apartment_types t ON a.type_id = t.type_id
                JOIN building_blocks bb ON a.block_id = bb.block_id
                WHERE UPPER(a.block_id) = 'D'
                `;

                // If a status filter was applied, also apply it to the D block query
                let filteredDBlockQuery = dBlockQuery;
                let dBlockParams = [];

                if (statuses.length > 0) {
                    filteredDBlockQuery += ` AND LOWER(a.status) IN (${statuses.map((_, i) => `LOWER($${i + 1})`).join(',')})`;
                    dBlockParams = [...statuses];
                    console.log("Adding status filter to D block query:", statuses);
                }

                try {
                    console.log("Direct D block query:", filteredDBlockQuery);
                    console.log("Direct D block parameters:", dBlockParams);

                    const dBlockResult = dBlockParams.length > 0
                        ? await db.query(filteredDBlockQuery, dBlockParams)
                        : await db.query(dBlockQuery);

                    console.log(`Direct query found ${dBlockResult.length} D block apartments`);

                    if (dBlockResult.length > 0) {
                        // Add these to the results
                        result = [...result, ...dBlockResult];
                        console.log(`Updated results to include D block apartments. New total: ${result.length}`);
                    } else {
                        console.log("No D block apartments matched the criteria (likely no apartments with requested status)");
                    }
                } catch (dBlockError) {
                    console.error("Error querying for D block directly:", dBlockError);
                }
            }
        }

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