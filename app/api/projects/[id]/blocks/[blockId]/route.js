import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Delete a block from a project
export async function DELETE(request, { params }) {
    try {
        const { id, blockId } = params;

        if (!id || !blockId) {
            return NextResponse.json(
                { status: "error", message: "Project ID and Block ID are required" },
                { status: 400 }
            );
        }

        // First, check if there are apartments using this block
        const apartments = await db.query(`
            SELECT COUNT(*) as count 
            FROM apartments 
            WHERE block_id = $1
        `, [blockId]);

        // If there are apartments using this block, we might want to prevent deletion
        // or implement cascading deletion depending on requirements

        // Delete the block
        await db.query(`
            DELETE FROM project_blocks
            WHERE block_id = $1 AND project_id = $2
        `, [blockId, id]);

        return NextResponse.json({
            status: "success",
            message: "Block deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting block:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "ბლოკის წაშლისას დაფიქსირდა შეცდომა",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
} 