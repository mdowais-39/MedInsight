const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── Types matching exact API specifications ───────────────────────────────

export interface PatientRegister {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface PatientResponse {
  patient_id: number;
}

export interface PatientDetails {
  patient_id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface DoctorRegister {
  name: string;
  specialization: string;
  department_id: number;
  experience_years: number;
  phone: string;
  email: string;
}

export interface DoctorResponse {
  doctor_id: number;
}

export interface DoctorDetails {
  doctor_id: number;
  name: string;
  specialization: string;
  department_id: number;
  experience_years: number;
  phone: string;
  email: string;
}

export interface Department {
  department_id: number;
  department_name: string;
}

export interface DoctorInDepartment {
  doctor_id: number;
  name: string;
  specialization: string;
}

export interface AppointmentBook {
  patient_id: number;
  doctor_id: number;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM:SS
}

export interface AppointmentResponse {
  appointment_id: number;
}

export interface RecordVisit {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  diagnosis: string;
  notes: string;
}

export interface VisitResponse {
  visit_id: number;
}

export interface AddPrescription {
  visit_id: number;
  medicine_name: string;
  dosage: string;
  duration_days: number;
}

export interface PrescriptionResponse {
  message: string;
}

export interface AddTreatment {
  visit_id: number;
  treatment_type: string;
  cost: number;
  notes: string;
}

export interface TreatmentResponse {
  message: string;
}

export interface PatientAppointment {
  appointment_id: number;
  doctor_id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export interface DoctorAppointment {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export interface PatientVisit {
  visit_id: number;
  appointment_id: number;
  doctor_id: number;
  doctor_name: string;
  diagnosis: string;
  visit_date: string;
  notes: string;
}

export interface VisitPrescription {
  prescription_id: number;
  medicine_name: string;
  dosage: string;
  duration_days: number;
}

export interface VisitTreatment {
  treatment_id: number;
  treatment_type: string;
  treatment_cost: number;
  treatment_notes: string;
}

export interface VisitDetails {
  visit_id: number;
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  doctor_name: string;
  patient_name: string;
  diagnosis: string;
  visit_date: string;
  notes: string;
  prescriptions: VisitPrescription[];
  treatments: VisitTreatment[];
}

// ─── Detailed Appointment Types ────────────────────────────────────────────

export interface DetailedPrescription {
  prescription_id: number;
  medicine_name: string;
  dosage: string;
  duration_days: number;
}

export interface DetailedTreatment {
  treatment_id: number;
  treatment_type: string;
  treatment_cost: number;
  treatment_notes?: string;
}

export interface DetailedVisit {
  visit_id: number;
  diagnosis: string;
  notes: string;
  visit_date: string;
  prescriptions: DetailedPrescription[];
  treatments: DetailedTreatment[];
}

export interface DoctorDetailedAppointment {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  visit?: DetailedVisit;
}

export interface PatientDetailedAppointment {
  appointment_id: number;
  doctor_id: number;
  doctor_name: string;
  doctor_specialization?: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  visit?: DetailedVisit;
}

// ─── Analytics Types ───────────────────────────────────────────────────────

export interface TopDoctor {
  doctor_id: number;
  total_appointments: number;
}

export interface DepartmentLoad {
  department_id: number;
  total_visits: number;
}

export interface MonthlyVisit {
  year: number;
  month: number;
  total_visits: number;
}

export interface DoctorWorkload {
  doctor_id: number;
  total_visits: number;
}

// ─── API Helper ────────────────────────────────────────────────────────────

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// ─── Patient APIs ──────────────────────────────────────────────────────────

export const patientAPI = {
  register: (data: PatientRegister) =>
    apiRequest<PatientResponse>("/patients/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getById: (patientId: number) =>
    apiRequest<PatientDetails>(`/patients/${patientId}`),
};

// ─── Doctor APIs ───────────────────────────────────────────────────────────

export const doctorAPI = {
  register: (data: DoctorRegister) =>
    apiRequest<DoctorResponse>("/doctors/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getById: (doctorId: number) =>
    apiRequest<DoctorDetails>(`/doctors/${doctorId}`),

  recordVisit: (data: RecordVisit) =>
    apiRequest<VisitResponse>("/doctor/record-visit", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addPrescription: (data: AddPrescription) =>
    apiRequest<PrescriptionResponse>("/doctor/add-prescription", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addTreatment: (data: AddTreatment) =>
    apiRequest<TreatmentResponse>("/doctor/add-treatment", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAppointments: (doctorId: number) =>
    apiRequest<DoctorAppointment[]>(`/appointments/doctor/${doctorId}`),

  getPatientVisits: (patientId: number) =>
    apiRequest<PatientVisit[]>(`/doctor/visits/patient/${patientId}`),

  getVisitDetails: (visitId: number) =>
    apiRequest<VisitDetails>(`/doctor/visits/${visitId}`),
};

// ─── Department APIs ───────────────────────────────────────────────────────

export const departmentAPI = {
  getAll: () => apiRequest<Department[]>("/departments/"),

  getDoctors: (departmentId: number) =>
    apiRequest<DoctorInDepartment[]>(`/departments/${departmentId}/doctors`),
};

// ─── Appointment APIs ──────────────────────────────────────────────────────

export const appointmentAPI = {
  book: (data: AppointmentBook) =>
    apiRequest<AppointmentResponse>("/appointments/book", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getByPatient: (patientId: number) =>
    apiRequest<PatientAppointment[]>(`/appointments/patient/${patientId}`),

  getByDoctor: (doctorId: number) =>
    apiRequest<DoctorAppointment[]>(`/appointments/doctor/${doctorId}`),
};

// ─── Analytics APIs ────────────────────────────────────────────────────────

export const analyticsAPI = {
  getTopDoctors: () =>
    apiRequest<TopDoctor[]>("/analytics/top-doctors"),

  getDepartmentLoad: () =>
    apiRequest<DepartmentLoad[]>("/analytics/department-load"),

  getMonthlyVisits: () =>
    apiRequest<MonthlyVisit[]>("/analytics/monthly-visits"),

  getDoctorWorkload: () =>
    apiRequest<DoctorWorkload[]>("/analytics/doctor-workload"),
};

