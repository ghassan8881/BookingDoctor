import { connectToDatabase } from "../../../lib/db";
import { hash } from "bcryptjs";

export async function POST(request) {
  try {
    const pool = await connectToDatabase();
    const requestBody = await request.json();

    // Destructure all fields from the request body
    const {
      firstName,
      lastName,
      firstName_ar,
      lastName_ar,
      email,
      phone,
      password,
      idNo,
      dateOfBirth,
      gender,
      address,
      city,
      role,
      specialtyId,
      clinicId,
      licenseNumber,
      photoURL = null, // Default to null if not provided
    } = requestBody;

    try {
      console.log(
        {
          firstName,
          lastName,
          firstName_ar,
          lastName_ar,
          email,
          phone,
          password,
          idNo,
          dateOfBirth,
          gender,
          address,
          city,
          role,
          specialtyId,
          clinicId,
          licenseNumber,
          photoURL, // Default to null if not provided
        },
        "data48"
      );

      // Check if user already exists by email or ID number
      const userCheck = await pool
        .request()
        .input("email", email)
        .input("idNo", idNo).query(`
          SELECT * FROM [User] 
          WHERE Email = @email OR IdNo = @idNo
        `);

      if (userCheck.recordset.length > 0) {
        const existingUser = userCheck.recordset[0];
        if (existingUser.Email === email) {
          return new Response(
            JSON.stringify({ message: "User already exists with this email" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        if (existingUser.IdNo === idNo) {
          return new Response(
            JSON.stringify({
              message: "User already exists with this ID number",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      // Hash password
      const hashedPassword = await hash(password, 10);
      const currentDate = new Date().toISOString();

      // Insert into User table with all fields
      const userResult = await pool
        .request()
        .input("firstName", firstName)
        .input("lastName", lastName)
        .input("firstName_ar", firstName_ar)
        .input("lastName_ar", lastName_ar)
        .input("email", email)
        .input("phone", phone)
        .input("passwordHash", hashedPassword)
        .input("photoURL", photoURL)
        .input("idNo", idNo)
        .input("dateOfBirth", dateOfBirth)
        .input("gender", gender)
        .input("address", address)
        .input("city", city)
        .input("role", role)
        .input("specialtyId", specialtyId)
        .input("clinicId", clinicId)
        .input("isActive", 1) // Default to active
        .input("createdDate", currentDate)
        .input("modifiedDate", currentDate).query(`
          INSERT INTO [User] (
            FirstName, LastName, FirstName_ar, LastName_ar,
            Email, Phone, PasswordHash, PhotoURL, IdNo,
            DateOfBirth, Gender, Address, City,
            Role, SpecialtyID, ClinicID, IsActive,
            CreatedDate, ModifiedDate
          )
          OUTPUT INSERTED.UserID
          VALUES (
            @firstName, @lastName, @firstName_ar, @lastName_ar,
            @email, @phone, @passwordHash, @photoURL, @idNo,
            @dateOfBirth, @gender, @address, @city,
            @role, @specialtyId, @clinicId, @isActive,
            @createdDate, @modifiedDate
          )
        `);

      const userId = userResult.recordset[0].UserID;

      // For doctors, you might want to add additional validation
      if (role === "doctor") {
        if (!licenseNumber) {
          return new Response(
            JSON.stringify({
              message: "License number is required for doctors",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // You could insert into a separate Doctors table here if needed
        // Similar to your original code, but adapted for your current structure
      }

      return new Response(
        JSON.stringify({
          message: "Registration successful",
          userId,
          role,
        }),
        {
          status: 201, // 201 Created is more appropriate for successful registration
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Database error during registration:", error);
      return new Response(
        JSON.stringify({
          message: "Registration failed due to database error",
          error: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        message: "Registration failed. Please try again.",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
