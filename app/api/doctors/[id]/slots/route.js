import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  // Validation
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
  }

  if (!date || !isValidDate(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use ISO8601" },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDatabase();
    console.log(date, "🚀 ~ GET ~ id:", id);
    const result = await pool
      .request()
      .input("doctorId", id)
      .input("date", new Date(date).toISOString())
      .query(
        "SELECT s.SlotID, s.StartTime, s.EndTime, s.IsDeleted, s.Status, s.PatientId FROM slots s WHERE s.DoctorID=@doctorId AND s.SlotDate = @date AND s.IsDeleted !=1 ORDER BY s.StartTime"
      );
    console.log(result.recordset.length, " ~ GET ~ result:32", result);

    // if (result.recordset.length === 0) {
    //   return new Response(JSON.stringify({ error: "slots not found" }), {
    //     status: 404,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  const { date, startTime, endTime } = await request.json();

  console.log(id, " startTime, endTime :57", date, startTime, endTime);
  // Validation
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
  }

  if (!date || !isValidDate(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use ISO8601" },
      { status: 400 }
    );
  }

  if (!startTime || !endTime) {
    return NextResponse.json(
      { error: "Start time and end time are required" },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDatabase();

    // Check if slot already exists
    const checkResult = await pool
      .request()
      .input("doctorId", id)
      .input("date", new Date(date).toISOString())
      .input("startTime", startTime)
      .input("endTime", endTime)
      .query(
        "SELECT SlotID FROM slots WHERE DoctorID=@doctorId AND SlotDate=@date AND StartTime=@startTime AND EndTime=@endTime"
      );

    if (checkResult.recordset.length > 0) {
      return NextResponse.json(
        { error: "Slot already exists" },
        { status: 409 }
      );
    }

    // Insert new slot
    const result = await pool
      .request()
      .input("doctorId", id)
      .input("date", new Date(date).toISOString())
      .input("startTime", startTime)
      .input("endTime", endTime)
      .query(
        "INSERT INTO slots (DoctorID, SlotDate, StartTime, EndTime) VALUES (@doctorId, @date, @startTime, @endTime)"
      );

    return NextResponse.json(
      { message: "Slot added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding slot:", error);
    return NextResponse.json({ error: "Failed to add slot" }, { status: 500 });
  }
}

function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}
