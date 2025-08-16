// import sql from "mssql";
import { connectToDatabase } from "../../../lib/db";

export async function GET(request) {
  try {
    console.log("🚀 ~ handler ~ Request received");

    // ✅ إنشاء الاتصال مرة واحدة فقط
    // if (!pool) {
    //   pool = await sql.connect(dbConfig);
    // }

    // ✅ تنفيذ الاستعلام
    // const result = await pool.request().query("SELECT * FROM Doctors");
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .query("SELECT * FROM [dbo].[User] where Role='Patient'");

    console.log("🚀 ~ handler ~ result:", result.recordset);

    // ✅ إرسال النتائج
    // res.status(200).json(result.recordset);
    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    // res.status(500).json({ error: "Failed to fetch doctors" });
  }
}
