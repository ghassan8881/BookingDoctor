-- Insert sample specialties
INSERT INTO Specialties (SpecialtyName, Description)
VALUES 
('Cardiology', 'Heart and cardiovascular system'),
('Dermatology', 'Skin, hair, and nails'),
('Pediatrics', 'Medical care for infants, children, and adolescents'),
('Neurology', 'Nervous system disorders'),
('Orthopedics', 'Musculoskeletal system');

-- Insert sample clinic
INSERT INTO Clinics (ClinicName, Address, City, State, PostalCode, Phone, Email)
VALUES 
('City Medical Center', '123 Health Ave', 'Metropolis', 'NY', '10001', '555-123-4567', 'info@citymedical.com'),
('City Medical Center1', '123 Health Ave1', 'Metropolis1', 'NY1', '100011', '555-123-45671', 'info1@citymedical.com'),
('City Medical Center2', '123 Health Ave2', 'Metropolis2', 'NY2', '100012', '555-123-45672', 'info2@citymedical.com'),
('City Medical Center3', '123 Health Ave3', 'Metropolis3', 'NY3', '100013', '555-123-45673', 'info3@citymedical.com'),
('City Medical Center4', '123 Health Ave4', 'Metropolis4', 'NY4', '100014', '555-123-45674', 'info4@citymedical.com');

-- Insert sample doctor
INSERT INTO Doctors (FirstName, LastName, SpecialtyID, ClinicID, Email, Phone, LicenseNumber, Bio)
VALUES 
('John', 'Smith', 1, 1, 'dr.smith@example.com', '555-987-6543', 'MD123456', 'Board certified cardiologist with 15 years of experience.'),
('John1', 'Smith1', 2, 3, 'dr.smith1@example.com', '555-987-65431', 'MD1234561', 'Board certified cardiologist with 15 years of experience1.'),
('John2', 'Smith2', 3, 4, 'dr.smith2@example.com', '555-987-65432', 'MD1234562', 'Board certified cardiologist with 15 years of experience2.'),
('John3', 'Smith3', 4, 5, 'dr.smith3@example.com', '555-987-65433', 'MD1234563', 'Board certified cardiologist with 15 years of experience3.'),
('John4', 'Smith4', 5, 6, 'dr.smith4@example.com', '555-987-65434', 'MD1234564', 'Board certified cardiologist with 15 years of experience4.');

-- Insert sample patient
INSERT INTO Patients (FirstName, LastName, Email, Phone, DateOfBirth, Gender)
VALUES 
('Jane', 'Doe', 'jane.doe@example.com', '555-456-7890', '1985-05-15', 'Female');

-- Insert sample schedule
INSERT INTO DoctorSchedules (DoctorID, DayOfWeek, StartTime, EndTime)
VALUES 
(1, 2, '09:00', '17:00'), -- Monday
(1, 3, '09:00', '17:00'), -- Tuesday
(1, 4, '09:00', '17:00'), -- Wednesday
(1, 5, '09:00', '17:00'), -- Thursday
(1, 6, '09:00', '12:00'); -- Friday (half day)

-- Insert sample user
INSERT INTO Users (Email, PasswordHash, Salt, Role, DoctorID, PatientID)
VALUES 
('dr.smith@example.com', 'hashed_password', 'salt_value', 'Doctor', 1, NULL),
('jane.doe@example.com', 'hashed_password', 'salt_value', 'Patient', NULL, 1);
GO

select * from Users