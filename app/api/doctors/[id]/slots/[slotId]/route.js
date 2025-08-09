import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../lib/db";
// PUT /api/doctors/[id]/slots/[slotId]
export async function PUT(request, { params }) {
  const { id, slotId } = params;
  console.log("🚀 ~ PUT ~ request:", request);
  // const { date, startTime, endTime } = await request.json();
  const data = await request.json();
  console.log(!data.patientId, "data:9", data);

  // console.log(
  //   await request.json().patientId,
  //   "patientId-request :123",
  //   request
  // );
  if (data.patientId) {
    const patientId = data.patientId;
    const Status = data.bookBy;

    console.log(id, slotId, "patientId :123", Status, patientId);
    try {
      const pool = await connectToDatabase();
      await pool
        .request()
        .input("SlotID", slotId)
        .input("PatientId", patientId)
        .input("Status", Status)
        .query(
          "UPDATE slots SET PatientId = @PatientId, Status =@Status WHERE SlotID = @SlotID"
        );

      return NextResponse.json(
        { message: "Appointment  Booked successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating slot:", error);
      return NextResponse.json(
        { error: "Failed to update slot" },
        { status: 500 }
      );
    }
  }
  if ([0, 1, 2].includes(data.status)) {
    const status = data.status;

    console.log(id, status, "status :123", status);
    try {
      const pool = await connectToDatabase();
      const condition = status == 0 ? " ,patientid=0" : "";
      console.log("🚀 ~ PUT ~ condition:49", condition);
      await pool
        .request()
        .input("SlotID", slotId)
        .input("status", status)
        .query(
          `UPDATE slots SET Status = @status ${condition} WHERE SlotID = @SlotID`
        );

      return NextResponse.json(
        { message: "Appointment  Booked successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating slot:", error);
      return NextResponse.json(
        { error: "Failed to update slot" },
        { status: 500 }
      );
    }
  }

  if (data.date) {
    const { date, startTime, endTime } = data;
    console.log(
      id,
      slotId,
      " startTime, endTime :123",
      date,
      startTime,
      endTime
    );
    // Validation (same as POST)
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
      await pool
        .request()
        .input("slotId", slotId)
        .input("startTime", startTime)
        .input("endTime", endTime)
        .query(
          "UPDATE slots SET StartTime = @startTime, EndTime = @endTime WHERE SlotID = @slotId"
        );

      return NextResponse.json(
        { message: "Slot updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating slot:", error);
      return NextResponse.json(
        { error: "Failed to update slot" },
        { status: 500 }
      );
    }
  }
}

// DELETE /api/doctors/[id]/slots/[slotId]
export async function DELETE(request, { params }) {
  const { id, slotId } = params;

  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("slotId", slotId)
      .query("DELETE FROM slots WHERE SlotID = @slotId");

    return NextResponse.json(
      { message: "Slot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting slot:", error);
    return NextResponse.json(
      { error: "Failed to delete slot" },
      { status: 500 }
    );
  }
}

function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}
