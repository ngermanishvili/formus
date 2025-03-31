import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// განაახლებს კონკრეტულ ბლოკს building_blocks ცხრილში
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { block_name, name_en, total_floors } = await request.json();

        if (!id) {
            return NextResponse.json(
                { status: "error", message: "ბლოკის ID აუცილებელია" },
                { status: 400 }
            );
        }

        // Build the update query
        let query = `UPDATE building_blocks SET `;
        const queryParams = [];
        const updates = [];

        if (block_name !== undefined) {
            queryParams.push(block_name);
            updates.push(`block_name = $${queryParams.length}`);
        }

        if (name_en !== undefined) {
            queryParams.push(name_en);
            updates.push(`name_en = $${queryParams.length}`);
        }

        if (total_floors !== undefined) {
            queryParams.push(total_floors);
            updates.push(`total_floors = $${queryParams.length}`);
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { status: "error", message: "არაფერი შეიცვალა" },
                { status: 400 }
            );
        }

        query += updates.join(', ');
        queryParams.push(id);
        query += ` WHERE block_id = $${queryParams.length} RETURNING block_id, block_name as name, name_en, total_floors`;

        // Update the building block
        const result = await db.query(query, queryParams);

        if (result.length === 0) {
            return NextResponse.json(
                { status: "error", message: "ბლოკი ვერ მოიძებნა" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "ბლოკი წარმატებით განახლდა",
            data: result[0]
        });
    } catch (error) {
        console.error('Error updating building block:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "ბლოკის განახლებისას დაფიქსირდა შეცდომა",
                detail: error.message
            },
            { status: 500 }
        );
    }
}

// წაშლის კონკრეტულ ბლოკს building_blocks ცხრილიდან
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { status: "error", message: "ბლოკის ID აუცილებელია" },
                { status: 400 }
            );
        }

        // Delete the building block
        await db.query(
            `DELETE FROM building_blocks WHERE block_id = $1`,
            [id]
        );

        return NextResponse.json({
            status: "success",
            message: "ბლოკი წარმატებით წაიშალა"
        });
    } catch (error) {
        console.error('Error deleting building block:', error);

        // Check if it's a foreign key constraint error
        if (error.code === '23503') {
            return NextResponse.json(
                {
                    status: "error",
                    message: "ბლოკი ვერ წაიშალა, რადგან მასზე მიბმულია ბინები",
                    detail: "ჯერ წაშალეთ ამ ბლოკთან დაკავშირებული ბინები"
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                status: "error",
                message: "ბლოკის წაშლისას დაფიქსირდა შეცდომა",
                detail: error.message
            },
            { status: 500 }
        );
    }
} 