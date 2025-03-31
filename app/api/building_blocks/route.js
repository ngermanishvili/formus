import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// მიიღებს ყველა ბლოკს building_blocks ცხრილიდან
export async function GET(request) {
    try {
        // Check if we need to filter by project_id
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');

        let query;
        let params = [];

        if (projectId) {
            console.log(`Fetching blocks for project_id: ${projectId}`);

            try {
                // First, check if there are any blocks for this project
                const checkQuery = `
                    SELECT COUNT(*) 
                    FROM project_blocks 
                    WHERE project_id = $1
                `;
                const checkResult = await db.query(checkQuery, [projectId]);
                const blockCount = parseInt(checkResult[0]?.count || '0');

                console.log(`Project ${projectId} has ${blockCount} blocks linked in project_blocks table`);

                // Try to use project_blocks table 
                query = `
                    SELECT bb.block_id, bb.block_name as name, bb.name_en, bb.total_floors 
                    FROM building_blocks bb
                    JOIN project_blocks pb ON bb.block_id = pb.block_id
                    WHERE pb.project_id = $1
                    ORDER BY bb.block_name
                `;
                params = [projectId];

                const result = await db.query(query, params);
                console.log(`Found ${result.length} blocks for project ${projectId}:`,
                    result.map(b => b.block_id).join(', '));

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
                // If project_blocks table doesn't exist, return all blocks
                console.error("Error using project_blocks table:", error.message);
                console.log("Falling back to returning all blocks");

                query = `
                    SELECT block_id, block_name as name, name_en, total_floors 
                    FROM building_blocks 
                    ORDER BY block_name
                `;
                params = [];
            }
        } else {
            // Get all blocks
            console.log("No project_id provided, fetching all blocks");
            query = `
                SELECT block_id, block_name as name, name_en, total_floors 
                FROM building_blocks 
                ORDER BY block_name
            `;
        }

        const result = await db.query(query, params);
        console.log(`Found ${result.length} blocks${projectId ? ` (fallback for project ${projectId})` : ''}:`,
            result.map(b => b.block_id).join(', '));

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
        console.error('Error fetching building blocks:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "ბლოკების მოძიებისას დაფიქსირდა შეცდომა",
                detail: error.message
            },
            { status: 500 }
        );
    }
}

// დაამატებს ახალ ბლოკს building_blocks ცხრილში
export async function POST(request) {
    try {
        const { block_name, name_en } = await request.json();

        if (!block_name) {
            return NextResponse.json(
                { status: "error", message: "ბლოკის სახელი აუცილებელია" },
                { status: 400 }
            );
        }

        // Use the provided English name or default to "{block_id} Block"
        const englishName = name_en || `${block_name.charAt(0)} Block`;

        const result = await db.query(
            `INSERT INTO building_blocks (block_name, name_en) 
             VALUES ($1, $2)
             RETURNING block_id, block_name as name, name_en`,
            [block_name, englishName]
        );

        return NextResponse.json({
            status: "success",
            message: "ბლოკი წარმატებით დაემატა",
            data: result[0]
        });
    } catch (error) {
        console.error('Error creating building block:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "ბლოკის დამატებისას დაფიქსირდა შეცდომა",
                detail: error.message
            },
            { status: 500 }
        );
    }
} 