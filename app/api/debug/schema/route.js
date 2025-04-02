import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get information about apartments table
        const apartmentsSchema = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'apartments'
    `);

        // Get information about floors table
        const floorsSchema = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'floors'
    `);

        // Get information about apartment_types table
        const typesSchema = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'apartment_types'
    `);

        // Get a sample of apartments data
        const apartmentsSample = await db.query(`
      SELECT * FROM apartments LIMIT 5
    `);

        // Get a sample of floors data
        const floorsSample = await db.query(`
      SELECT * FROM floors LIMIT 5
    `);

        return NextResponse.json({
            status: "success",
            data: {
                schema: {
                    apartments: apartmentsSchema,
                    floors: floorsSchema,
                    apartment_types: typesSchema
                },
                samples: {
                    apartments: apartmentsSample,
                    floors: floorsSample
                }
            }
        });
    } catch (error) {
        console.error('Error fetching schema:', error);
        return NextResponse.json(
            {
                status: "error",
                message: "Error fetching schema information",
                detail: error.message
            },
            { status: 500 }
        );
    }
} 