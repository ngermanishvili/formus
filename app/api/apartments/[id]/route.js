// app/api/apartments/[id]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // 1. Retrieve type_id
    const typeResult = await db.query(
      `SELECT type_id FROM apartments WHERE apartment_id = $1`,
      [id]
    );
    console.log('Type Result:', typeResult);

    if (!typeResult || typeResult.length === 0) {
      return NextResponse.json(
        { status: "error", message: "ბინა ვერ მოიძებნა" },
        { status: 404 }
      );
    }

    const typeId = typeResult[0].type_id;
    if (!typeId) {
      return NextResponse.json(
        { status: "error", message: "type_id ვერ მოიძებნა" },
        { status: 500 }
      );
    }

    // 2. Update apartment_types
    await db.query(`
      UPDATE apartment_types
      SET 
        total_area = $1,
        studio_area = $2,
        bedroom_area = $3,
        bedroom2_area = $4,
        bathroom_area = $5,
        bathroom2_area = $6,
        living_room_area = $7,
        balcony_area = $8,
        balcony2_area = $9
      WHERE type_id = $10
    `, [
      data.total_area || null,
      data.studio_area || null,
      data.bedroom_area || null,
      data.bedroom2_area || null,
      data.bathroom_area || null,
      data.bathroom2_area || null,
      data.living_room_area || null,
      data.balcony_area || null,
      data.balcony2_area || null,
      typeId
    ]);

    // 3. Update apartments
    await db.query(`
      UPDATE apartments
      SET 
        apartment_number = $1,
        floor = $2,
        status = $3,
        home_2d = $4,
        home_3d = $5
      WHERE apartment_id = $6
    `, [
      data.apartment_number || null,
      data.floor || null,
      data.status || null,
      data.home_2d || null,
      data.home_3d || null,
      id
    ]);

    // 4. Fetch updated apartment data
    const updatedApartment = await db.query(`
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
        t.balcony2_area
      FROM apartments a
      JOIN apartment_types t ON a.type_id = t.type_id
      WHERE a.apartment_id = $1
    `, [id]);

    if (!updatedApartment || updatedApartment.length === 0) {
      return NextResponse.json(
        { status: "error", message: "განახლებული ბინის მონაცემები ვერ მოიძებნა" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "ბინა წარმატებით განახლდა",
      data: updatedApartment[0]
    });

  } catch (error) {
    console.error('Error updating apartment:', {
      message: error.message,
      stack: error.stack,
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

export async function GET(request, { params }) {
  try {
    const { id } = params;

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
        t.balcony2_area
      FROM apartments a
      JOIN apartment_types t ON a.type_id = t.type_id
      WHERE a.apartment_id = $1
    `, [id]);

    if (!result || result.length === 0) {
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

// app/api/apartments/route.js
export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);

    // Insert apartment type and return its ID
    const typeResult = await db.query(
      `INSERT INTO apartment_types (
        total_area,
        studio_area,
        bedroom_area,
        bedroom2_area,
        bathroom_area,
        bathroom2_area,
        living_room_area,
        balcony_area,
        balcony2_area
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING type_id`,
      [
        parseFloat(data.total_area) || 0,
        parseFloat(data.studio_area) || 0,
        parseFloat(data.bedroom_area) || 0,
        parseFloat(data.bedroom2_area) || 0,
        parseFloat(data.bathroom_area) || 0,
        parseFloat(data.bathroom2_area) || 0,
        parseFloat(data.living_room_area) || 0,
        parseFloat(data.balcony_area) || 0,
        parseFloat(data.balcony2_area) || 0
      ]
    );

    console.log("Type creation result:", typeResult);

    const typeId = typeResult[0]?.type_id;
    console.log("Created type with ID:", typeId);

    if (!typeId) {
      throw new Error("Failed to create apartment type");
    }

    // Insert apartment and return its ID
    const apartmentResult = await db.query(
      `INSERT INTO apartments (
        block_id,
        apartment_number,
        floor,
        type_id,
        status,
        home_2d,
        home_3d
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING apartment_id`,
      [
        data.block_id,
        data.apartment_number.toString(),
        parseInt(data.floor),
        typeId,
        'available',
        data.home_2d || null,
        data.home_3d || null
      ]
    );

    console.log("Apartment creation result:", apartmentResult);

    const apartmentId = apartmentResult[0]?.apartment_id;
    console.log("Created apartment with ID:", apartmentId);

    if (!apartmentId) {
      // If apartment creation failed, delete the recently created type
      await db.query('DELETE FROM apartment_types WHERE type_id = $1', [typeId]);
      throw new Error("Failed to create apartment");
    }

    // Fetch complete information about the new apartment
    const newApartment = await db.query(`
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
        t.balcony2_area
      FROM apartments a
      JOIN apartment_types t ON a.type_id = t.type_id
      WHERE a.apartment_id = $1
    `, [apartmentId]);

    return NextResponse.json({
      status: "success",
      message: "ბინა წარმატებით დაემატა",
      data: {
        apartment_id: apartmentId,
        type_id: typeId,
        details: newApartment[0]
      }
    });

  } catch (error) {
    console.error("Error creating apartment:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });

    return NextResponse.json(
      {
        status: "error",
        message: "შეცდომა ბინის დამატებისას",
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          detail: error.detail,
          hint: error.hint
        } : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // First delete from apartment_types
    await db.query(`
      DELETE FROM apartment_types 
      WHERE type_id IN (
        SELECT type_id 
        FROM apartments 
        WHERE apartment_id = $1
      )
    `, [id]);

    // Then delete the apartment
    const result = await db.query(
      'DELETE FROM apartments WHERE apartment_id = $1',
      [id]
    );

    if (!result || result.length === 0) {
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
    console.error('Error deleting apartment:', {
      message: error.message,
      stack: error.stack,
      detail: error.detail
    });

    return NextResponse.json({
      status: "error",
      message: "შეცდომა ბინის წაშლისას",
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}