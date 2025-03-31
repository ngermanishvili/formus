import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        console.log('Requesting project with ID:', params.id);

        const project = await db.query(
            'SELECT * FROM projects WHERE id = $1',
            [params.id]
        );

        if (!project?.length) {
            return NextResponse.json({
                status: "error",
                message: "პროექტი ვერ მოიძებნა"
            }, { status: 404 });
        }

        const data = project[0];

        if (typeof data.features_en === 'string') {
            data.features_en = JSON.parse(data.features_en);
        }
        if (typeof data.features_ge === 'string') {
            data.features_ge = JSON.parse(data.features_ge);
        }

        return NextResponse.json({
            status: "success",
            data
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        if (!data.title_en || !data.title_ge || !data.description_en || !data.description_ge) {
            return NextResponse.json({
                status: "error",
                message: "Missing required fields"
            }, { status: 400 });
        }

        const result = await db.query(`
            UPDATE projects 
            SET 
                title_en = $1,
                title_ge = $2,
                description_en = $3,
                description_ge = $4,
                main_image_url = $5,
                location_en = $6,
                location_ge = $7,
                features_en = $8,
                features_ge = $9,
                second_section_img = $10,
                second_section_title_en = $11,
                second_section_title_ge = $12,
                second_section_description_en = $13,
                second_section_description_ge = $14,
                display_order = $15,
                is_active = $16,
                updated_at = NOW()
            WHERE id = $17
            RETURNING *
        `, [
            data.title_en,
            data.title_ge,
            data.description_en,
            data.description_ge,
            data.main_image_url,
            data.location_en,
            data.location_ge,
            JSON.stringify(data.features_en),
            JSON.stringify(data.features_ge),
            data.second_section_img,
            data.second_section_title_en,
            data.second_section_title_ge,
            data.second_section_description_en,
            data.second_section_description_ge,
            data.display_order || null,
            data.is_active || false,
            id
        ]);

        if (!result?.length) {
            return NextResponse.json({
                status: "error",
                message: "პროექტი ვერ მოიძებნა"
            }, { status: 404 });
        }

        const updatedProject = result[0];

        if (typeof updatedProject.features_en === 'string') {
            updatedProject.features_en = JSON.parse(updatedProject.features_en);
        }
        if (typeof updatedProject.features_ge === 'string') {
            updatedProject.features_ge = JSON.parse(updatedProject.features_ge);
        }

        return NextResponse.json({
            status: "success",
            message: "პროექტი წარმატებით განახლდა",
            data: updatedProject
        });

    } catch (error) {
        console.error('Update Error:', error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // Delete the project
        const result = await db.query(`
            DELETE FROM projects
            WHERE id = $1
            RETURNING id
        `, [id]);

        if (!result.length) {
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