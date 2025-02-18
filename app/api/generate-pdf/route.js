// app/api/generate-pdf/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import ReactPDF from '@react-pdf/renderer';
import ApartmentPDF from "@/app/[locale]/choose-apartment/apartment-pdf";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    const apartment = searchParams.get('apartment');

    if (!block || !apartment) {
        return NextResponse.json({
            status: "error",
            message: "block და apartment პარამეტრები აუცილებელია"
        }, { status: 400 });
    }

    try {
        const results = await db.query(`
            SELECT 
                a.apartment_id,
                a.block_id,
                a.apartment_number,
                a.floor,
                a.type_id,
                a.status,
                a.polygon_coords,
                a.floor_id,
                a.price,
                a.metadata,
                a.home_2d,
                a.home_3d,
                t.total_area,
                t.studio_area, 
                t.bedroom_area,
                t.bedroom2_area,
                t.bathroom_area,
                t.bathroom2_area,
                t.living_room_area,
                t.balcony_area,
                t.balcony2_area
            FROM apartments a
            JOIN apartment_types t ON a.type_id = t.type_id
            WHERE a.block_id = $1 AND a.apartment_number = $2;
        `, [block, apartment]);

        console.log('Query results:', results);

        if (!results || results.length === 0) {
            return NextResponse.json({
                status: "error",
                message: "ბინა ვერ მოიძებნა"
            }, { status: 404 });
        }

        // მონაცემების მომზადება PDF-ისთვის
        const apartmentData = {
            ...results[0],
            // Cloudinary URL-ები პირდაპირ გამოვიყენოთ
            home_2d: results[0].home_2d || null,
            home_3d: results[0].home_3d || null
        };

        console.log('Prepared apartment data:', apartmentData);

        try {
            const pdfStream = await ReactPDF.renderToStream(
                <ApartmentPDF apartmentData={apartmentData} />
            );

            const response = new NextResponse(pdfStream, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="apartment-${block}-${apartment}.pdf"`,
                    'Cache-Control': 'no-cache'
                }
            });

            return response;

        } catch (pdfError) {
            console.error('PDF Rendering Error:', pdfError);
            return NextResponse.json({
                status: "error",
                message: "PDF-ის რენდერისას დაფიქსირდა შეცდომა",
                details: pdfError.message
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Database or General Error:', error);
        return NextResponse.json({
            status: "error",
            message: "მონაცემების მიღებისას დაფიქსირდა შეცდომა",
            details: error.message
        }, { status: 500 });
    }
}