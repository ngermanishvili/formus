import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Get blocks for a specific project
export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { status: "error", message: "Project ID is required" },
                { status: 400 }
            );
        }

        const result = await db.query(`
            SELECT pb.block_id, bb.block_name as name, bb.description
            FROM project_blocks pb
            JOIN building_blocks bb ON pb.block_id = bb.block_id
            WHERE pb.project_id = $1
            ORDER BY bb.block_name
        `, [id]);

        return NextResponse.json({
            status: "success",
            data: result
        });
    } catch (error) {
        console.error('Error fetching project blocks:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "ბლოკების მოძიებისას დაფიქსირდა შეცდომა",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

// POST handler - Create a new block and associate it with the project
export async function POST(request, { params }) {
    try {
        const { id } = params;
        const { name } = await request.json();

        if (!id) {
            return NextResponse.json(
                { status: "error", message: "Project ID is required" },
                { status: 400 }
            );
        }

        if (!name) {
            return NextResponse.json(
                { status: "error", message: "Block name is required" },
                { status: 400 }
            );
        }

        // First create or find the block in building_blocks
        const blockResult = await db.query(`
            INSERT INTO building_blocks (block_id, block_name) 
            VALUES ($1, $2)
            ON CONFLICT (block_id) DO UPDATE 
            SET block_name = EXCLUDED.block_name
            RETURNING block_id, block_name as name
        `, [name, name + " ბლოკი"]);

        if (!blockResult || blockResult.length === 0) {
            throw new Error("Failed to create building block");
        }

        const blockId = blockResult[0].block_id;

        // Now create the association in project_blocks
        await db.query(`
            INSERT INTO project_blocks (project_id, block_id)
            VALUES ($1, $2)
            ON CONFLICT (project_id, block_id) DO NOTHING
        `, [id, blockId]);

        return NextResponse.json({
            status: "success",
            message: "Block created and associated with project",
            data: blockResult[0]
        });
    } catch (error) {
        console.error('Error creating block:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "ბლოკის შექმნისას დაფიქსირდა შეცდომა",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
} 