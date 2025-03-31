import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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