import { connectToDatabase } from "../../../../lib/db";

export async function GET(request) {
  try {
    // Extract ID from URL parameters
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ error: "Doctor ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pool = await connectToDatabase();
    // Use parameterized query to prevent SQL injection
    const result = await pool
      .request()
      .input("doctorId", id)
      .query(
        "select * from [dbo].[User] where Role='doctor' and USERID = @doctorId"
      );

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: "Doctor not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result.recordset[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
