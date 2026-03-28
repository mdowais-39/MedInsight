-- Most Busy Doctors
SELECT doctor_id,
COUNT(*) AS total_appointments
FROM Appointments
GROUP BY doctor_id
ORDER BY total_appointments DESC
LIMIT 10;

-- Visit per department
SELECT
department_id,
SUM(total_visits)
FROM FactVisits
GROUP BY department_id
ORDER BY SUM(total_visits) DESC;

-- Monthly patient visits
SELECT
t.year,
t.month,
SUM(f.total_visits)
FROM FactVisits f
JOIN DimTime t
ON f.appointment_date = t.date
GROUP BY t.year, t.month
ORDER BY t.year, t.month;

-- Doctor Workload
SELECT
doctor_id,
SUM(total_visits)
FROM FactVisits
GROUP BY doctor_id
ORDER BY SUM(total_visits) DESC;

