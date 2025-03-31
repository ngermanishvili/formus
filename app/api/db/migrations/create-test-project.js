export const dynamic = 'force-dynamic';

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Creates a test project with T and Y blocks and apartments
 */
export async function GET() {
    try {
        // 1. Create a new project: "სატესტო რედისონ პროექტი"
        console.log("Creating test project...");

        // Check if project already exists
        const projectCheck = await db.query(`
            SELECT id FROM projects WHERE title_ge = 'სატესტო რედისონ პროექტი'
        `);

        let projectId;

        if (projectCheck.length === 0) {
            // Create new project
            const projectResult = await db.query(`
                INSERT INTO projects (
                    title_en,
                    title_ge,
                    description_en,
                    description_ge,
                    main_image_url,
                    is_active
                )
                VALUES (
                    'Test Radisson Project', 
                    'სატესტო რედისონ პროექტი',
                    'This is a test project created for testing purpose',
                    'ეს არის სატესტო პროექტი შექმნილი ტესტირებისთვის',
                    'https://res.cloudinary.com/ds9dsumwl/image/upload/v1741953967/formus/aw4bnj9sxdvxcgftqjrb.png',
                    true
                )
                RETURNING id
            `);

            projectId = projectResult[0]?.id;
            console.log(`Created new project with ID: ${projectId}`);
        } else {
            projectId = projectCheck[0].id;
            console.log(`Project already exists with ID: ${projectId}`);
        }

        // 2. Create T and Y blocks if they don't exist
        const blocks = ['T', 'Y'];
        const blockResults = [];

        for (const blockId of blocks) {
            // Check if block exists
            const blockCheck = await db.query(`
                SELECT block_id FROM building_blocks WHERE block_id = $1
            `, [blockId]);

            if (blockCheck.length === 0) {
                // Create block
                await db.query(`
                    INSERT INTO building_blocks (block_id, block_name, total_floors, apartments_per_floor)
                    VALUES ($1, $2, 12, 4)
                    ON CONFLICT (block_id) DO NOTHING
                `, [blockId, blockId]);

                blockResults.push({ block: blockId, created: true });
                console.log(`Created block ${blockId}`);
            } else {
                blockResults.push({ block: blockId, created: false });
                console.log(`Block ${blockId} already exists`);
            }

            // Link block to project
            await db.query(`
                INSERT INTO project_blocks (project_id, block_id)
                VALUES ($1, $2)
                ON CONFLICT (project_id, block_id) DO NOTHING
            `, [projectId, blockId]);

            console.log(`Linked block ${blockId} to project ${projectId}`);
        }

        // 3. Create apartments in T and Y blocks
        const apartmentResults = [];

        // First create apartment types
        const typeResult = await db.query(`
            INSERT INTO apartment_types (
                total_area, studio_area, bedroom_area, bedroom2_area, 
                bathroom_area, bathroom2_area, living_room_area, balcony_area,
                type_name
            )
            VALUES 
                (85.5, NULL, 22.0, 18.5, 8.0, 6.0, 22.0, 9.0, 'Type T'),
                (92.3, NULL, 24.0, 20.0, 9.0, 7.5, 23.0, 8.8, 'Type Y')
            ON CONFLICT DO NOTHING
            RETURNING type_id
        `);

        // Get existing types if none were created
        const typeIds = typeResult.length > 0
            ? typeResult.map(row => row.type_id)
            : (await db.query(`
                SELECT type_id FROM apartment_types 
                WHERE type_name IN ('Type T', 'Type Y')
                LIMIT 2
              `)).map(row => row.type_id);

        if (typeIds.length < 2) {
            throw new Error("Failed to get or create apartment types");
        }

        const tTypeId = typeIds[0];
        const yTypeId = typeIds[1];

        // Create one apartment in T block
        const tAptCheck = await db.query(`
            SELECT apartment_id FROM apartments 
            WHERE block_id = 'T' AND apartment_number = 'T502'
        `);

        if (tAptCheck.length === 0) {
            const tAptResult = await db.query(`
                INSERT INTO apartments (
                    block_id, apartment_number, floor, type_id, status,
                    price, home_2d, home_3d
                )
                VALUES (
                    'T', 'T502', 5, $1, 'available',
                    250000, 'https://res.cloudinary.com/ds9dsumwl/image/upload/v1741953967/formus/aw4bnj9sxdvxcgftqjrb.png', 'https://res.cloudinary.com/ds9dsumwl/image/upload/v1741953967/formus/aw4bnj9sxdvxcgftqjrb.png'
                )
                RETURNING apartment_id
            `, [tTypeId]);

            apartmentResults.push({
                block: 'T',
                apartment: 'T502',
                created: true,
                id: tAptResult[0]?.apartment_id
            });

            console.log(`Created apartment T502 with ID: ${tAptResult[0]?.apartment_id}`);
        } else {
            apartmentResults.push({
                block: 'T',
                apartment: 'T502',
                created: false,
                id: tAptCheck[0]?.apartment_id
            });

            console.log(`Apartment T502 already exists with ID: ${tAptCheck[0]?.apartment_id}`);
        }

        // Create one apartment in Y block
        const yAptCheck = await db.query(`
            SELECT apartment_id FROM apartments 
            WHERE block_id = 'Y' AND apartment_number = 'Y701'
        `);

        if (yAptCheck.length === 0) {
            const yAptResult = await db.query(`
                INSERT INTO apartments (
                    block_id, apartment_number, floor, type_id, status,
                    price, home_2d, home_3d
                )
                VALUES (
                    'Y', 'Y701', 7, $1, 'available',
                    280000, 'https://res.cloudinary.com/ds9dsumwl/image/upload/v1741953967/formus/aw4bnj9sxdvxcgftqjrb.png', 'https://res.cloudinary.com/ds9dsumwl/image/upload/v1741953967/formus/aw4bnj9sxdvxcgftqjrb.png'
                )
                RETURNING apartment_id
            `, [yTypeId]);

            apartmentResults.push({
                block: 'Y',
                apartment: 'Y701',
                created: true,
                id: yAptResult[0]?.apartment_id
            });

            console.log(`Created apartment Y701 with ID: ${yAptResult[0]?.apartment_id}`);
        } else {
            apartmentResults.push({
                block: 'Y',
                apartment: 'Y701',
                created: false,
                id: yAptCheck[0]?.apartment_id
            });

            console.log(`Apartment Y701 already exists with ID: ${yAptCheck[0]?.apartment_id}`);
        }

        return NextResponse.json({
            status: "success",
            message: "სატესტო პროექტი წარმატებით შეიქმნა",
            data: {
                project: {
                    id: projectId,
                    title: "სატესტო რედისონ პროექტი",
                    created: projectCheck.length === 0
                },
                blocks: blockResults,
                apartments: apartmentResults
            }
        });
    } catch (error) {
        console.error('Error creating test project:', error);
        return NextResponse.json({
            status: "error",
            message: "სატესტო პროექტის შექმნისას დაფიქსირდა შეცდომა",
            error: error.message
        }, { status: 500 });
    }
} 