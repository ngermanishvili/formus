// app/api/test-db/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM building_blocks LIMIT 1");

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      result: result,
    });
  } catch (error) {
    console.error("Connection error details:", {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
    });

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
