import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Check if D block exists in building_blocks
        const blockCheck = await db.query("SELECT * FROM building_blocks WHERE block_id = 'D'");

        if (blockCheck.length === 0) {
            console.log("D block not found in building_blocks table, creating it...");

            // Create D block
            await db.query(`
                INSERT INTO building_blocks (block_id, block_name, total_floors, apartments_per_floor)
                VALUES ('D', 'D', 15, 4)
                ON CONFLICT (block_id) DO NOTHING
            `);
        } else {
            console.log("D block already exists in building_blocks table");
        }

        // Check if there are any apartments in D block
        const aptCheck = await db.query("SELECT COUNT(*) FROM apartments WHERE block_id = 'D'");
        const dBlockAptCount = parseInt(aptCheck[0]?.count || '0');

        if (dBlockAptCount === 0) {
            console.log("No apartments found in D block, creating sample apartments...");

            // Create a type for D block apartments
            const typeResult = await db.query(`
                INSERT INTO apartment_types (
                    total_area, studio_area, bedroom_area, bedroom2_area, 
                    bathroom_area, bathroom2_area, living_room_area, balcony_area
                )
                VALUES (90.5, NULL, 20.5, 18.0, 10.0, 8.0, 24.0, 10.0)
                RETURNING type_id
            `);

            const typeId = typeResult[0]?.type_id;

            if (!typeId) {
                throw new Error("Failed to create apartment type");
            }

            // Create 5 sample apartments in D block
            const floors = [1, 3, 5, 7, 9];
            const statuses = ['available', 'sold', 'sold', 'available', 'sold'];

            for (let i = 0; i < floors.length; i++) {
                const aptNumber = `D${floors[i]}${i + 1}`;

                await db.query(`
                    INSERT INTO apartments (
                        block_id, apartment_number, floor, type_id, status,
                        home_2d, home_3d
                    )
                    VALUES (
                        'D', $1, $2, $3, $4,
                        'blocks/d/apt1_2d', 'blocks/d/apt1_3d'
                    )
                `, [aptNumber, floors[i], typeId, statuses[i]]);
            }

            console.log(`Created ${floors.length} sample apartments in D block`);
        } else {
            console.log(`Found ${dBlockAptCount} apartments in D block already`);
        }

        return NextResponse.json({
            success: true,
            message: "D block setup complete",
        });

    } catch (error) {
        console.error("Error in seed script:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
} 