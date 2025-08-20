-- Create the database
CREATE DATABASE DoctorBookingSystem;
GO

-- Use the database
USE DoctorBookingSystem;
GO

CREATE TABLE Specialties (
    SpecialtyID INT IDENTITY(1,1) PRIMARY KEY,
    SpecialtyName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE Clinics (
    ClinicID INT IDENTITY(1,1) PRIMARY KEY,
    ClinicName NVARCHAR(100) NOT NULL,
    Address NVARCHAR(200) NOT NULL,
    City NVARCHAR(50) NOT NULL,
    State NVARCHAR(50) NOT NULL,
    PostalCode NVARCHAR(20) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    Email NVARCHAR(100) NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);
GO
CREATE TABLE Doctors (
    DoctorID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    SpecialtyID INT NOT NULL,
    ClinicID INT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NOT NULL,
    LicenseNumber NVARCHAR(50) NULL,
    Bio NVARCHAR(MAX) NULL,
    PhotoURL NVARCHAR(255) NULL,
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (SpecialtyID) REFERENCES Specialties(SpecialtyID),
    FOREIGN KEY (ClinicID) REFERENCES Clinics(ClinicID)
);
GO
CREATE TABLE Patients (
    PatientID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NOT NULL,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(10) NULL,
    Address NVARCHAR(200) NULL,
    City NVARCHAR(50) NULL,
    State NVARCHAR(50) NULL,
    PostalCode NVARCHAR(20) NULL,
    MedicalHistory NVARCHAR(MAX) NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);
GO
CREATE TABLE DoctorSchedules (
    ScheduleID INT IDENTITY(1,1) PRIMARY KEY,
    DoctorID INT NOT NULL,
    DayOfWeek INT NOT NULL, -- 1=Sunday, 2=Monday, etc.
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsWorkingDay BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);
GO
CREATE TABLE Appointments (
    AppointmentID INT IDENTITY(1,1) PRIMARY KEY,
    DoctorID INT NOT NULL,
    PatientID INT NOT NULL,
    AppointmentDateTime DATETIME NOT NULL,
    EndDateTime DATETIME NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Scheduled', -- Scheduled, Completed, Cancelled, No-Show
    Reason NVARCHAR(500) NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);
GO
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Salt NVARCHAR(100) NOT NULL,
    Role NVARCHAR(20) NOT NULL, -- Admin, Doctor, Patient
    DoctorID INT NULL,
    PatientID INT NULL,
    IsActive BIT DEFAULT 1,
    LastLogin DATETIME NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);
GO
-- Indexes for faster queries
CREATE INDEX IX_Appointments_DoctorID ON Appointments(DoctorID);
CREATE INDEX IX_Appointments_PatientID ON Appointments(PatientID);
CREATE INDEX IX_Appointments_DateTime ON Appointments(AppointmentDateTime);
CREATE INDEX IX_Doctors_SpecialtyID ON Doctors(SpecialtyID);
CREATE INDEX IX_DoctorSchedules_DoctorID ON DoctorSchedules(DoctorID);
GO
===========================

USE [YourDatabaseName]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Create the Slots table
CREATE TABLE [dbo].[Slots](
    [SlotID] [int] IDENTITY(1,1) NOT NULL,
    [DoctorID] [int] NOT NULL,
    [SlotDate] [date] NOT NULL,
    [StartTime] [time](0) NOT NULL,
    [EndTime] [time](0) NOT NULL,
    [IsAvailable] [bit] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime2](7) NOT NULL DEFAULT SYSUTCDATETIME(),
    [LastUpdated] [datetime2](7) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT [PK_Slots] PRIMARY KEY CLUSTERED ([SlotID] ASC))
GO

-- Create foreign key to Doctors table
ALTER TABLE [dbo].[Slots] WITH CHECK 
ADD CONSTRAINT [FK_Slots_Doctors] FOREIGN KEY([DoctorID])
REFERENCES [dbo].[Doctors] ([DoctorID])
ON DELETE CASCADE
GO

-- Create index for performance on common queries
CREATE NONCLUSTERED INDEX [IX_Slots_DoctorDate] ON [dbo].[Slots]
(
    [DoctorID] ASC,
    [SlotDate] ASC
)
INCLUDE ([IsAvailable], [StartTime], [EndTime])
GO

-- Create a trigger to update LastUpdated timestamp
== not excuted =====
CREATE TRIGGER [dbo].[trg_Slots_UpdateTimestamp]
ON [dbo].[Slots]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [dbo].[Slots]
    SET [LastUpdated] = SYSUTCDATETIME()
    FROM [dbo].[Slots] s
    INNER JOIN inserted i ON s.[SlotID] = i.[SlotID]
END
GO

-- Add check constraint for valid time slots
ALTER TABLE [dbo].[Slots] WITH CHECK
ADD CONSTRAINT [CK_Slots_ValidTimes] CHECK ([EndTime] > [StartTime])
GO

-- Add constraint for future dates only
ALTER TABLE [dbo].[Slots] WITH CHECK
ADD CONSTRAINT [CK_Slots_FutureDate] CHECK ([SlotDate] >= CAST(GETDATE() AS date))
GO

-- Insert sample data (optional)
INSERT INTO [dbo].[Slots] (
    [DoctorID],
    [SlotDate],
    [StartTime],
    [EndTime],
    [IsAvailable]
)
VALUES
    (1, DATEADD(day, 1, GETDATE()), '09:00:00', '09:30:00', 1),
    (1, DATEADD(day, 1, GETDATE()), '09:30:00', '10:00:00', 1),
    (1, DATEADD(day, 1, GETDATE()), '10:00:00', '10:30:00', 0),
    (3, DATEADD(day, 2, GETDATE()), '14:00:00', '14:30:00', 1),
    (3, DATEADD(day, 2, GETDATE()), '14:30:00', '15:00:00', 1)
GO