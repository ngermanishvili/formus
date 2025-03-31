export const dynamic = 'force-dynamic';

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Creates project_blocks table for linking projects with building blocks
 */
export async function GET() {
    try {
        const result = await createProjectBlocksTable();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating project_blocks table:', error);
        return NextResponse.json({
            status: "error",
            message: "ცხრილის შექმნისას დაფიქსირდა შეცდომა",
            error: error.message
        }, { status: 500 });
    }
}

/**
 * Function to create project_blocks table that can be used by other modules
 */
export default async function createProjectBlocksTable() {
    try {
        // Check if table exists
        const tableCheck = await db.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'project_blocks'
            );
        `);

        const tableExists = tableCheck[0]?.exists || false;

        if (tableExists) {
            return {
                status: "success",
                message: "project_blocks ცხრილი უკვე არსებობს",
                created: false
            };
        }

        // Create project_blocks table
        await db.query(`
            CREATE TABLE project_blocks (
                id SERIAL PRIMARY KEY,
                project_id INTEGER NOT NULL,
                block_id VARCHAR(20) NOT NULL,
                CONSTRAINT fk_project 
                    FOREIGN KEY(project_id) 
                    REFERENCES projects(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_block
                    FOREIGN KEY(block_id)
                    REFERENCES building_blocks(block_id)
                    ON DELETE CASCADE,
                CONSTRAINT project_block_unique UNIQUE(project_id, block_id)
            );
        `);

        // For existing projects, link all blocks to the project with ID 1 (assuming Ortachala Hills)
        await db.query(`
            INSERT INTO project_blocks (project_id, block_id)
            SELECT 1, block_id FROM building_blocks
            ON CONFLICT (project_id, block_id) DO NOTHING;
        `);

        return {
            status: "success",
            message: "project_blocks ცხრილი წარმატებით შეიქმნა",
            created: true
        };
    } catch (error) {
        console.error('Error creating project_blocks table:', error);
        throw error;
    }
} 