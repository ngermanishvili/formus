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

        // Special case: if project_id is specified but that project has no apartments yet,
        // return empty array immediately, don't try to fallback to other projects
        if (project_id) {
            console.log(`Checking if project ID ${project_id} has any apartments...`);
            const projectCheck = await db.query(
                `SELECT EXISTS (
                    SELECT 1 FROM apartments a
                    JOIN building_blocks bb ON a.block_id = bb.block_id
                    JOIN project_blocks pb ON bb.block_id = pb.block_id
                    WHERE pb.project_id = $1
                ) as has_apartments`,
                [project_id]
            );

            console.log(`Project check result:`, projectCheck[0]);

            if (!projectCheck[0].has_apartments) {
                console.log(`Project ID ${project_id} has no apartments yet. Returning empty result.`);
                return NextResponse.json(
                    { status: "success", data: [] },
                    {
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            "Pragma": "no-cache",
                            "Expires": "0"
                        }
                    }
                );
            }
        }

        // Build the query - using explicit JOINs with project_blocks table when project_id is specified
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
                pb.project_id,
                p.title_ge as project_name
            FROM apartments a
            JOIN apartment_types t ON a.type_id = t.type_id
            JOIN building_blocks bb ON a.block_id = bb.block_id
        `;

        // Initialize parameters
        let paramIndex = 1;
        const queryParams = [];

        // Add where conditions
        const whereConditions = [];

        // Modify query structure based on project_id
        if (project_id) {
            // First, check if apartments table has project_id column
            try {
                // When filtering by project_id, use the most direct relationship if available
                query += `
                JOIN project_blocks pb ON bb.block_id = pb.block_id AND pb.project_id = $${paramIndex}
                JOIN projects p ON pb.project_id = p.id
                `;

                // Add an additional WHERE clause to ensure only apartments from this project are returned
                whereConditions.push(`pb.project_id = $${paramIndex}`);

                // Add project_id as first parameter
                queryParams.push(project_id);
                paramIndex++;
                console.log(`Using strict filtering for project_id: ${project_id}`);
            } catch (error) {
                console.error("Error with project filtering:", error);
                // Fallback to original implementation
                query += `
                JOIN project_blocks pb ON bb.block_id = pb.block_id
                JOIN projects p ON pb.project_id = p.id
                `;
                whereConditions.push(`pb.project_id = $${paramIndex++}`);
                queryParams.push(project_id);
            }
        } else {
            // Without project_id filter, use regular JOINs
            query += `
            JOIN project_blocks pb ON bb.block_id = pb.block_id
            JOIN projects p ON pb.project_id = p.id
            `;
        }

        // Add block filter if provided - block_id only (not block_name)
        if (blocks.length > 0) {
            if (project_id) {
                // If project_id is specified, filter blocks only for that project
                const placeholders = [];
                const blockParams = [];

                // For each block in the blocks array - we're only filtering by block_id
                for (const block of blocks) {
                    placeholders.push(`UPPER(bb.block_id) = $${paramIndex++}`);
                    blockParams.push(block.toUpperCase());
                }

                whereConditions.push(`(${placeholders.join(' OR ')}) AND pb.project_id = $1`);
                queryParams.push(...blockParams);

                console.log(`Filtering apartments by block_ids (strict project-specific):`, blocks);
            } else {
                // Standard block filtering without project context
                const placeholders = [];
                const blockParams = [];

                // For each block in the blocks array - we're only filtering by block_id
                for (const block of blocks) {
                    placeholders.push(`UPPER(bb.block_id) = $${paramIndex++}`);
                    blockParams.push(block.toUpperCase());
                }

                whereConditions.push(`(${placeholders.join(' OR ')})`);
                queryParams.push(...blockParams);

                console.log(`Filtering apartments by block_ids:`, blocks);
            }
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

        // Log the distinct project IDs in the result to debug cross-project issues
        const projectIds = [...new Set(result.map(apt => apt.project_id))];
        console.log(`Apartments belong to these projects:`, projectIds);

        // Process the result to handle duplicate apartment IDs
        if (project_id) {
            console.log("Deduplicating apartments for specific project...");
            // Create a map to track unique apartments by apartment_id
            const apartmentMap = {};

            // First, group apartments by ID
            result.forEach(apt => {
                if (!apartmentMap[apt.apartment_id]) {
                    apartmentMap[apt.apartment_id] = [];
                }
                apartmentMap[apt.apartment_id].push(apt);
            });

            // Then, for each apartment ID, ensure we only keep the one matching our project
            const dedupedResult = [];

            Object.keys(apartmentMap).forEach(aptId => {
                const apartments = apartmentMap[aptId];

                // If there's only one apartment with this ID, keep it
                if (apartments.length === 1) {
                    dedupedResult.push(apartments[0]);
                } else {
                    // Multiple apartments with same ID - find the one matching our project
                    const matchingApt = apartments.find(apt =>
                        String(apt.project_id) === String(project_id)
                    );

                    if (matchingApt) {
                        dedupedResult.push(matchingApt);
                    }
                }
            });

            console.log(`After deduplication: ${dedupedResult.length} apartments (was ${result.length})`);
            result = dedupedResult;
        }

        // Return the result with no-cache headers
        return NextResponse.json(
            { status: "success", data: result },
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