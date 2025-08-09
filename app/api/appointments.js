// import sql from "mssql";
import { connectToDatabase } from "../../lib/db";

// Database configuration
// const dbConfig = {
//   user: "your_username",
//   password: "your_password",
//   server: "your_server.database.windows.net", // or localhost
//   database: "your_database",
//   options: {
//     encrypt: true, // for Azure
//     trustServerCertificate: true, // for local dev
//   },
// };

export default async function handler(req, res) {
  // Create a connection pool
  // let pool;
  try {
    const pool = await connectToDatabase();
    if (req.method === "POST") {
      const { doctorId, patientId, dateTime } = req.body;

      try {
        const result = await pool
          .request()
          .input("dateTime", new Date(dateTime))
          .input("status", "2")
          .input("doctorId", parseInt(doctorId))
          .input("patientId", parseInt(1)).query(`
            INSERT INTO appointments (dateTime, status, doctorId, patientId)
            VALUES (@dateTime, @status, @doctorId, @patientId);
            SELECT SCOPE_IDENTITY() as id;
          `);

        const appointment = {
          id: result.recordset[0].id,
          dateTime: new Date(dateTime),
          status: "2",
          doctorId: parseInt(doctorId),
          patientId: parseInt(1),
        };

        res.status(201).json(appointment);
      } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ error: "Failed to create appointment" });
      }
    } else if (req.method === "GET") {
      const { patientId } = req.query;

      try {
        const result = await pool
          .request()
          .input("patientId", parseInt(patientId)).query(`
            SELECT a.*, d.name as doctorName, d.specialty as doctorSpecialty
            FROM appointments a
            JOIN doctors d ON a.doctorId = d.id
            WHERE a.patientId = @patientId
          `);

        const appointments = result.recordset.map((row) => ({
          id: row.id,
          dateTime: row.dateTime,
          status: row.status,
          doctorId: row.doctorId,
          patientId: row.patientId,
          doctor: {
            name: row.doctorName,
            specialty: row.doctorSpecialty,
          },
        }));

        res.status(200).json(appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
      }
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  } finally {
    // Close the connection pool
    if (pool) {
      await pool.close();
    }
  }
}
