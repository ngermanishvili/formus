import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        console.log('Requesting about page info for project ID:', id);

        const projectInfo = await db.query(`
            SELECT * FROM project_info 
            WHERE project_id = $1 AND section_type = 'about_page'
            ORDER BY display_order ASC
        `, [id]);

        return NextResponse.json({
            status: "success",
            data: projectInfo
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
} 