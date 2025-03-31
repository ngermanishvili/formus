import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        console.log('Requesting project info for project ID:', id);

        const projectInfo = await db.query(`
            SELECT * FROM project_info 
            WHERE project_id = $1
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

export async function POST(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        if (!data.title_ge || !data.description_ge) {
            return NextResponse.json({
                status: "error",
                message: "აუცილებელი ველები არ არის შევსებული"
            }, { status: 400 });
        }

        const result = await db.query(`
            INSERT INTO project_info (
                project_id,
                title_en,
                title_ge,
                description_en,
                description_ge,
                subtitle_en,
                subtitle_ge,
                image_url,
                display_order,
                section_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            id,
            data.title_en || '',
            data.title_ge,
            data.description_en || '',
            data.description_ge,
            data.subtitle_en || '',
            data.subtitle_ge || '',
            data.image_url || '',
            data.display_order || 0,
            data.section_type || 'feature'
        ]);

        return NextResponse.json({
            status: "success",
            message: "პროექტის ინფორმაცია წარმატებით დაემატა",
            data: result[0]
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
        const { infoId, ...data } = await request.json();

        if (!infoId) {
            return NextResponse.json({
                status: "error",
                message: "Info ID არ არის მითითებული"
            }, { status: 400 });
        }

        if (!data.title_ge || !data.description_ge) {
            return NextResponse.json({
                status: "error",
                message: "აუცილებელი ველები არ არის შევსებული"
            }, { status: 400 });
        }

        const result = await db.query(`
            UPDATE project_info
            SET
                title_en = $1,
                title_ge = $2,
                description_en = $3,
                description_ge = $4,
                subtitle_en = $5,
                subtitle_ge = $6,
                image_url = $7,
                display_order = $8,
                section_type = $9,
                updated_at = NOW()
            WHERE id = $10 AND project_id = $11
            RETURNING *
        `, [
            data.title_en || '',
            data.title_ge,
            data.description_en || '',
            data.description_ge,
            data.subtitle_en || '',
            data.subtitle_ge || '',
            data.image_url || '',
            data.display_order || 0,
            data.section_type || 'feature',
            infoId,
            id
        ]);

        if (!result.length) {
            return NextResponse.json({
                status: "error",
                message: "პროექტის ინფორმაცია ვერ მოიძებნა"
            }, { status: 404 });
        }

        return NextResponse.json({
            status: "success",
            message: "პროექტის ინფორმაცია წარმატებით განახლდა",
            data: result[0]
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const { infoId } = await request.json();

        if (!infoId) {
            return NextResponse.json({
                status: "error",
                message: "Info ID არ არის მითითებული"
            }, { status: 400 });
        }

        const result = await db.query(`
            DELETE FROM project_info
            WHERE id = $1 AND project_id = $2
            RETURNING id
        `, [infoId, id]);

        if (!result.length) {
            return NextResponse.json({
                status: "error",
                message: "პროექტის ინფორმაცია ვერ მოიძებნა"
            }, { status: 404 });
        }

        return NextResponse.json({
            status: "success",
            message: "პროექტის ინფორმაცია წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
} 