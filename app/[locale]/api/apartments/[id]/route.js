// app/api/apartments/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    console.log('Updating apartment:', { id, ...data });

    const typeResult = await db.query(
      `SELECT type_id FROM apartments WHERE apartment_id = $1`,
      [id]
    );

    if (!typeResult.length) {
      return NextResponse.json(
        {
          status: "error",
          message: "Apartment not found"
        },
        { status: 404 }
      );
    }

    const typeId = typeResult[0].type_id;

    // 2. განვაახლოთ apartment_types
    await db.query(`
            UPDATE apartment_types
            SET 
                total_area = $1,
                studio_area = $2,
                bedroom_area = $3,
                bathroom_area = $4,
                living_room_area = $5,
                balcony_area = $6
            WHERE type_id = $7
        `, [
      data.total_area,
      data.studio_area,
      data.bedroom_area,
      data.bathroom_area,
      data.living_room_area,
      data.balcony_area,
      typeId
    ]);

    console.log('Updated apartment_types');

    // 3. განვაახლოთ apartments
    await db.query(`
            UPDATE apartments
            SET 
                apartment_number = $1,
                floor = $2
            WHERE apartment_id = $3
        `, [data.apartment_number, data.floor, id]);

    console.log('Updated apartments');

    // 4. წამოვიღოთ განახლებული მონაცემები დასადასტურებლად
    const updatedApartment = await db.query(`
            SELECT 
                a.*,
                t.total_area,
                t.studio_area,
                t.bedroom_area,
                t.bathroom_area,
                t.living_room_area,
                t.balcony_area
            FROM apartments a
            JOIN apartment_types t ON a.type_id = t.type_id
            WHERE a.apartment_id = $1
        `, [id]);

    return NextResponse.json({
      status: "success",
      message: "ბინა წარმატებით განახლდა",
      data: updatedApartment[0]
    });

  } catch (error) {
    console.error('Error updating apartment:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });

    return NextResponse.json(
      {
        status: "error",
        message: "შეცდომა ბინის განახლებისას",
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// მონაცემების წამოღების ფუნქცია
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await db.query(`
            SELECT 
                a.*,
                t.total_area,
                t.studio_area,
                t.bedroom_area,
                t.bathroom_area,
                t.living_room_area,
                t.balcony_area
            FROM apartments a
            JOIN apartment_types t ON a.type_id = t.type_id
            WHERE a.apartment_id = $1
        `, [id]);

    if (!result.length) {
      return NextResponse.json(
        {
          status: "error",
          message: "ბინა ვერ მოიძებნა"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: result[0]
    });

  } catch (error) {
    console.error('Error fetching apartment:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });

    return NextResponse.json(
      {
        status: "error",
        message: "შეცდომა ბინის მოძიებისას",
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // ჯერ წავშალოთ apartment_types
    await db.query(`
      DELETE FROM apartment_types 
      WHERE type_id IN (
        SELECT type_id 
        FROM apartments 
        WHERE apartment_id = $1
      )
    `, [id]);

    // შემდეგ წავშალოთ apartment
    const result = await db.query(
      'DELETE FROM apartments WHERE apartment_id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({
        status: "error",
        message: "ბინა ვერ მოიძებნა"
      }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: "ბინა წარმატებით წაიშალა"
    });

  } catch (error) {
    console.error('Error deleting apartment:', error);
    return NextResponse.json({
      status: "error",
      message: "შეცდომა ბინის წაშლისას"
    }, { status: 500 });
  }
}