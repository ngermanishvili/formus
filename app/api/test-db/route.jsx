// app/api/homes/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT 
        house_no,
        full_area,
        house_kv,
        coords,
        floor,
        id,
        studio,
        bedroom,
        bedroom2,
        bedroom3,
        bedroom4,
        bathroom,
        bathroom2,
        bathroom3,
        living_room,
        kitchen,
        balcony,
        hall
      FROM homes
    `;

    const homes = await db.query(query);

    return NextResponse.json({
      status: "success",
      data: homes,
    });
  } catch (error) {
    console.error("Error fetching homes:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch homes data",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// კონკრეტული სახლის წამოღებისთვის ID-ის მიხედვით
export async function POST(request) {
  try {
    const { id } = await request.json();

    const query = `
      SELECT 
        house_no,
        full_area,
        house_kv,
        coords,
        floor,
        id,
        studio,
        bedroom,
        bedroom2,
        bedroom3,
        bedroom4,
        bathroom,
        bathroom2,
        bathroom3,
        living_room,
        kitchen,
        balcony,
        hall
      FROM homes
      WHERE id = ?
    `;

    const [home] = await db.query(query, [id]);

    if (!home) {
      return NextResponse.json(
        {
          status: "error",
          message: "Home not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      status: "success",
      data: home,
    });
  } catch (error) {
    console.error("Error fetching home:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch home data",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
