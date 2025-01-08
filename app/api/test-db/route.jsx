// app/api/test-db/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // მარტივი ტესტ კვერი
    const result = await db.query("SELECT 1 + 1 as test");

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      result: result,
    });
  } catch (error) {
    console.error("Connection error details:", {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error.message,
        details: {
          code: error.code,
          errno: error.errno,
          sqlState: error.sqlState,
        },
      },
      { status: 500 }
    );
  }
}
