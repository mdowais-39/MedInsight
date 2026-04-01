-- doctor lookup
CREATE INDEX idx_doctors_department
ON Doctors(department_id);


-- patient appointment lookup
CREATE INDEX idx_appointments_patient
ON Appointments(patient_id);


-- doctor schedule lookup
CREATE INDEX idx_appointments_doctor
ON Appointments(doctor_id);


-- Date based queries
CREATE INDEX idx_appointments_date
ON Appointments(appointment_date);


-- visit lookup
CREATE INDEX idx_visits_patient
ON Visits(patient_id);


-- prescription lookup
CREATE INDEX idx_prescreiptions_visit
ON Prescriptions(visit_id);

