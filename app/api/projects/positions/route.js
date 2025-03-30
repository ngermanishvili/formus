import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const { positions } = await request.json();

        if (!positions || !Array.isArray(positions)) {
            return NextResponse.json({
                status: "error",
                message: "პოზიციების სიის ფორმატი არასწორია"
            }, { status: 400 });
        }

        // Update each project's position in the database
        for (const item of positions) {
            if (!item.id || item.display_order === undefined) {
                continue; // Skip invalid entries
            }

            await db.query(`
                UPDATE projects 
                SET display_order = $1
                WHERE id = $2
            `, [item.display_order, item.id]);
        }

        return NextResponse.json({
            status: "success",
            message: "პოზიციები წარმატებით განახლდა"
        });
    } catch (error) {
        console.error("Error updating positions:", error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
} 