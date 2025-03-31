import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Function to add name_en field to building_blocks table
 */
async function addNameEnToBuildingBlocksTable() {
    try {
        // Check if the name_en column already exists
        const columnCheck = await db.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'building_blocks' AND column_name = 'name_en'
            );
        `);

        const columnExists = columnCheck[0]?.exists || false;

        if (columnExists) {
            return {
                status: "success",
                message: "name_en ველი უკვე არსებობს building_blocks ცხრილში",
                created: false
            };
        }

        // Add the name_en column
        await db.query(`
            ALTER TABLE building_blocks 
            ADD COLUMN name_en VARCHAR(50);
        `);

        // Update existing records with English names
        await db.query(`
            UPDATE building_blocks
            SET name_en = 
                CASE 
                    WHEN block_id = 'A' THEN 'A Block'
                    WHEN block_id = 'B' THEN 'B Block'
                    WHEN block_id = 'C' THEN 'C Block'
                    WHEN block_id = 'D' THEN 'D Block'
                    WHEN block_id = 'E' THEN 'A Block'
                    WHEN block_id = 'F' THEN 'F Block'
                    WHEN block_id = 'G' THEN 'G Block'
                    WHEN block_id = 'H' THEN 'H Block'
                    WHEN block_id = 'I' THEN 'I Block'
                    WHEN block_id = 'J' THEN 'J Block'
                    WHEN block_id = 'K' THEN 'K Block'
                    WHEN block_id = 'L' THEN 'L Block'
                    WHEN block_id = 'M' THEN 'M Block'
                    WHEN block_id = 'N' THEN 'N Block'
                    WHEN block_id = 'O' THEN 'O Block'
                    WHEN block_id = 'P' THEN 'P Block'
                    WHEN block_id = 'Q' THEN 'Q Block'
                    WHEN block_id = 'R' THEN 'R Block'
                    WHEN block_id = 'S' THEN 'S Block'
                    WHEN block_id = 'T' THEN 'T Block'
                    WHEN block_id = 'U' THEN 'U Block'
                    WHEN block_id = 'V' THEN 'V Block'
                    WHEN block_id = 'W' THEN 'W Block'
                    WHEN block_id = 'X' THEN 'X Block'
                    WHEN block_id = 'Y' THEN 'Y Block'
                    WHEN block_id = 'Z' THEN 'Z Block'
                    ELSE block_id || ' Block'
                END;
        `);

        return {
            status: "success",
            message: "name_en ველი წარმატებით დაემატა building_blocks ცხრილში",
            created: true
        };
    } catch (error) {
        console.error('Error adding name_en to building_blocks table:', error);
        throw error;
    }
}

/**
 * Adds name_en field to building_blocks table for multilingual support
 */
export async function GET() {
    try {
        const result = await addNameEnToBuildingBlocksTable();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error adding name_en to building_blocks table:', error);
        return NextResponse.json({
            status: "error",
            message: "ცხრილის განახლებისას დაფიქსირდა შეცდომა",
            error: error.message
        }, { status: 500 });
    }
} 