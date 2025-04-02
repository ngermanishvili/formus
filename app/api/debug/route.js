import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Get information about the tables
        const tableInfo = await db.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name, column_name
        `);

        // Get simple apartment list without any complex filtering
        const apartments = await db.query(`
            SELECT 
                apartment_id, 
                block_id, 
                apartment_number, 
                floor, 
                status,
                type_id
            FROM apartments 
            LIMIT 5
        `);

        // Get apartment types
        const types = await db.query(`
            SELECT type_id, total_area
            FROM apartment_types
            LIMIT 5
        `);

        // Get information about project_blocks
        const projectBlocks = await db.query(`
            SELECT * 
            FROM project_blocks
            LIMIT 5
        `);

        // Get information about projects
        const projects = await db.query(`
            SELECT *
            FROM projects
            LIMIT 5
        `);

        return NextResponse.json({
            status: "success",
            data: {
                schema: tableInfo,
                apartments,
                types,
                projectBlocks,
                projects
            }
        });
    } catch (error) {
        console.error('Error debugging database:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "მონაცემთა ბაზის დიაგნოსტიკისას დაფიქსირდა შეცდომა",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
} 