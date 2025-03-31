import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({
                status: "error",
                message: "Project ID is required"
            }, { status: 400 });
        }

        console.log('DELETE request for project ID:', id);

        // Delete the project
        const result = await db.query(`
            DELETE FROM projects
            WHERE id = $1
            RETURNING id
        `, [id]);

        console.log('Delete query result:', result);

        if (!result.length) {
            console.log('No project found with ID:', id);
            return NextResponse.json({
                status: "error",
                message: "პროექტი ვერ მოიძებნა"
            }, { status: 404 });
        }

        // Also clean up related project information
        await db.query(`
            DELETE FROM project_info
            WHERE project_id = $1
        `, [id]);

        console.log('Successfully deleted project with ID:', id);
        return NextResponse.json({
            status: "success",
            message: "პროექტი წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('Delete Project Error:', error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
} 