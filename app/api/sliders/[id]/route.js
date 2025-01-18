// app/api/sliders/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// სლაიდერის წაშლა
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        await db.query(
            'DELETE FROM landing_sliders WHERE id = $1',
            [id]
        );

        return NextResponse.json({
            status: "success",
            message: "სლაიდერი წაიშალა"
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა სლაიდერის წაშლისას"
            },
            { status: 500 }
        );
    }
}

// სლაიდერის განახლება
export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const result = await db.query(
            `UPDATE landing_sliders 
             SET title_ge = $1, 
                 title_en = $2, 
                 description_ge = $3, 
                 description_en = $4,
                 image_url = $5,
                 order_position = $6
             WHERE id = $7
             RETURNING *`,
            [
                data.title_ge,
                data.title_en,
                data.description_ge,
                data.description_en,
                data.image_url,
                data.order_position,
                id
            ]
        );

        return NextResponse.json({
            status: "success",
            message: "სლაიდერი განახლდა",
            data: result[0]
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა სლაიდერის განახლებისას"
            },
            { status: 500 }
        );
    }
}

// სლაიდერის წამოღება
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const result = await db.query(
            'SELECT * FROM landing_sliders WHERE id = $1',
            [id]
        );

        if (result.length === 0) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "სლაიდერი ვერ მოიძებნა"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            data: result[0]
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა სლაიდერის მოძიებისას",
                detail: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

// სლაიდერის პოზიციის განახლება
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();
        const { direction } = data;

        // ჯერ ვიპოვოთ მიმდინარე სლაიდერი
        const currentSlider = await db.query(
            'SELECT order_position FROM landing_sliders WHERE id = $1',
            [id]
        );

        if (currentSlider.length === 0) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "სლაიდერი ვერ მოიძებნა"
                },
                { status: 404 }
            );
        }

        const currentPosition = currentSlider[0].order_position;
        let newPosition;

        if (direction === "up") {
            newPosition = currentPosition - 1;
        } else {
            newPosition = currentPosition + 1;
        }

        // ვიპოვოთ სლაიდერი ახალ პოზიციაზე
        const swapSlider = await db.query(
            'SELECT id FROM landing_sliders WHERE order_position = $1',
            [newPosition]
        );

        if (swapSlider.length > 0) {
            // თუ არსებობს სლაიდერი ახალ პოზიციაზე, გავცვალოთ პოზიციები
            await db.query(
                `UPDATE landing_sliders 
         SET order_position = CASE 
           WHEN id = $1 THEN $2 
           WHEN id = $3 THEN $4 
         END
         WHERE id IN ($1, $3)`,
                [id, newPosition, swapSlider[0].id, currentPosition]
            );
        }

        return NextResponse.json({
            status: "success",
            message: "სლაიდერის პოზიცია განახლდა"
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: "შეცდომა სლაიდერის პოზიციის განახლებისას"
            },
            { status: 500 }
        );
    }
}