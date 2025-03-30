import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { projects } = await request.json();

        if (!projects || !Array.isArray(projects)) {
            return NextResponse.json({
                status: "error",
                message: "პროექტების მასივი აუცილებელია"
            }, { status: 400 });
        }

        // Update each project's display_order
        for (const project of projects) {
            await db.query(`
                UPDATE projects 
                SET display_order = $1
                WHERE id = $2
            `, [project.display_order, project.id]);
        }

        return NextResponse.json({
            status: "success",
            message: "პროექტების პოზიციები წარმატებით განახლდა"
        });
    } catch (error) {
        console.error('Order Update Error:', error);
        return NextResponse.json({
            status: "error",
            message: "პოზიციების განახლებისას დაფიქსირდა შეცდომა"
        }, { status: 500 });
    }
} 