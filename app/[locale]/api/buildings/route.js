// app/api/buildings/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blocks = await db.query(`
      SELECT * FROM building_blocks
      ORDER BY block_id
    `);

    return NextResponse.json({
      status: "success",
      data: blocks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
