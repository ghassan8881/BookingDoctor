import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from "../../../lib/db";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request().input("email", session.user.email)
      .query(`
        SELECT 
      *
        FROM [dbo].[User]
        WHERE Email = @email
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const user = result.recordset[0];
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
  //   finally {
  //     await closeConnection(); // Close the connection after use
  //   }
}
