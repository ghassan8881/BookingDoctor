select * from [dbo].[Doctors]
select * from [dbo].[Appointments]
select * from [dbo].[Clinics]
select * from [dbo].[DoctorSchedules]
select * from [dbo].[Patients]
select * from [dbo].[Specialties]
select * from [dbo].[Users]
select * from [dbo].[User]
select * from [dbo].[Slots] where DoctorID in (4)

UserID, Email, PasswordHash, Salt, Role, DoctorID, PatientID, IsActive, LastLogin, CreatedDate, ModifiedDate

SELECT UserID, Email, PasswordHash, Role FROM Users WHERE Email = 'dr.smith@example.com'


======= 
select * from [dbo].[User] where Role='doctor' and USERID=4
select * from [dbo].[Doctors]
delete Clinics where ClinicID=2

update Slots set SlotDate='2025-07-17' where SlotID= 2
ALTER TABLE  Doctors ADD  LastName_ar nvarchar(50)
update Doctors set FirstName_ar=N'1جون',LastName_ar=N'1سميث' where DoctorID in (2)
$2b$10$r084xrUoUW/nklo6KQ7d9OpFHVs.pjI5YJzj3bh3vi5gn.YNPbaky
$2b$10$/fS1Rl1NgjTPPeNpuyly3eJxp.9lyQiamkhl4tEn6lD8zR.B1nEzm
update Users set PasswordHash=N'$2b$10$/fS1Rl1NgjTPPeNpuyly3eJxp.9lyQiamkhl4tEn6lD8zR.B1nEzm'
==============
-- Optional: Password reset tokens
CREATE TABLE PasswordResetTokens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    token NVARCHAR(255) NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(UserId))
	====================
	SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Slots](
	[SlotID] [int] IDENTITY(1,1) NOT NULL,
	[DoctorID] [int] NOT NULL,
	[SlotDate] [date] NOT NULL,
	[StartTime] [time](0) NOT NULL,
	[EndTime] [time](0) NOT NULL,
	[IsAvailable] [bit] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[LastUpdated] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Slots] PRIMARY KEY CLUSTERED 
(
	[SlotID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Slots] ADD  DEFAULT ((1)) FOR [IsAvailable]
GO

ALTER TABLE [dbo].[Slots] ADD  DEFAULT (sysutcdatetime()) FOR [CreatedAt]
GO

ALTER TABLE [dbo].[Slots] ADD  DEFAULT (sysutcdatetime()) FOR [LastUpdated]
GO

ALTER TABLE [dbo].[Slots]  WITH CHECK ADD  CONSTRAINT [FK_Slots_Doctors] FOREIGN KEY([DoctorID])
REFERENCES [dbo].[Doctors] ([DoctorID])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[Slots] CHECK CONSTRAINT [FK_Slots_Doctors]
GO

ALTER TABLE [dbo].[Slots]  WITH CHECK ADD  CONSTRAINT [CK_Slots_FutureDate] CHECK  (([SlotDate]>=CONVERT([date],getdate())))
GO

ALTER TABLE [dbo].[Slots] CHECK CONSTRAINT [CK_Slots_FutureDate]
GO

ALTER TABLE [dbo].[Slots]  WITH CHECK ADD  CONSTRAINT [CK_Slots_ValidTimes] CHECK  (([EndTime]>[StartTime]))
GO

ALTER TABLE [dbo].[Slots] CHECK CONSTRAINT [CK_Slots_ValidTimes]
GO
===============================

ALTER TABLE Users DROP column salt  

============ 29-7-2025=========
EXEC sp_rename 'Slots.IsAvailable', 'IsDeleted', 'COLUMN';

ALTER TABLE Slots ADD Status TINYINT NOT NULL DEFAULT 0
ALTER TABLE Slots ADD PatientId INT NOT NULL DEFAULT 0


=========================================
CREATE TABLE [User] (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    FirstName_ar NVARCHAR(100),
    LastName_ar NVARCHAR(100),
    
    -- Computed columns for full names
    FullName AS (FirstName + ' ' + LastName) PERSISTED,
    FullName_ar AS (COALESCE(FirstName_ar + ' ', '') + COALESCE(LastName_ar, '')) PERSISTED,
    
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20),
    PhotoURL NVARCHAR(255),
    IdNo NVARCHAR(50),
    DateOfBirth DATE,
    
    -- Age computed from DateOfBirth (updated automatically)
    Age AS (DATEDIFF(YEAR, DateOfBirth, GETDATE()) - 
           CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, DateOfBirth, GETDATE()), DateOfBirth) > GETDATE() 
           THEN 1 ELSE 0 END),
    
    Gender NVARCHAR(10)  NOT NULL ,
    Address NVARCHAR(255),
    City NVARCHAR(100),
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL CHECK (Role IN ('Admin', 'Doctor', 'Patient', 'Staff')),
    SpecialtyID INT,
    ClinicID INT,
    IsActive BIT DEFAULT 1,
    LastLogin DATETIME2,
    CreatedDate DATETIME2 DEFAULT SYSDATETIME(),
    ModifiedDate DATETIME2 DEFAULT SYSDATETIME(),
    
    -- Computed column for user status
    StatusDescription AS (CASE 
                        WHEN IsActive = 1 THEN 'Active'
                        ELSE 'Inactive'
                        END) PERSISTED,
    
    CONSTRAINT UQ_User_Email UNIQUE (Email),
    CONSTRAINT UQ_User_IdNo UNIQUE (IdNo),
    
    -- Indexes
    INDEX IX_User_Email NONCLUSTERED (Email),
    INDEX IX_User_Phone NONCLUSTERED (Phone),
    INDEX IX_User_Role NONCLUSTERED (Role),
    INDEX IX_User_ClinicID NONCLUSTERED (ClinicID)
);