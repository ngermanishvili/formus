// app/api/generate-pdf/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import ReactPDF from '@react-pdf/renderer';
import ApartmentPDF from "@/app/[locale]/choose-apartment/apartment-pdf";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    const apartment = searchParams.get('apartment');

    try {
        const result = await db.query(`
           SELECT 
               a.*,
               t.total_area,
               t.studio_area, 
               t.bedroom_area,
               t.bedroom2_area,
               t.bathroom_area,
               t.bathroom2_area,
               t.living_room_area,
               t.balcony_area,
               t.balcony2_area,
               t.block_id,
               t.floor,
               t.apartment_number,
               t.home_2d,
               t.home_3d,
           FROM apartments a
           JOIN apartment_types t ON a.type_id = t.type_id
           WHERE a.block_id = $1 AND a.apartment_number = $2
       `, [block, apartment]);

        if (result.rows.length === 0) {
            return NextResponse.json({
                status: "error",
                message: "ბინა ვერ მოიძებნა"
            }, { status: 404 });
        }

        const pdfStream = await ReactPDF.renderToStream(
            <ApartmentPDF apartmentData={result.rows[0]} />
        );

        return new NextResponse(pdfStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="apartment-${block}-${apartment}.pdf"`
            }
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({
            status: "error",
            message: "PDF-ის გენერაციისას დაფიქსირდა შეცდომა"
        }, { status: 500 });
    }
}