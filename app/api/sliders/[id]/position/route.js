// app/api/sliders/[id]/position/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
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