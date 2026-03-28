"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Users, Stethoscope, Calendar, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopDoctorsChart } from "./components/top-doctors-chart";
import { DepartmentLoadChart } from "./components/department-load-chart";
import { MonthlyVisitsChart } from "./components/monthly-visits-chart";
import { DoctorWorkloadChart } from "./components/doctor-workload-chart";
import {
  analyticsAPI,
  TopDoctor,
  DepartmentLoad,
  MonthlyVisit,
  DoctorWorkload,
  KPIs,
  doctorAPI,
  departmentAPI,
} from "@/lib/api";

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
}

interface Department {
  department_id: number;
  department_name: string;
}

export default function AnalyticsDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [topDoctors, setTopDoctors] = useState<TopDoctor[]>([]);
  const [departmentLoad, setDepartmentLoad] = useState<DepartmentLoad[]>([]);
  const [monthlyVisits, setMonthlyVisits] = useState<MonthlyVisit[]>([]);
  const [doctorWorkload, setDoctorWorkload] = useState<DoctorWorkload[]>([]);

  const [doctors, setDoctors] = useState<Map<number, string>>(new Map());
  const [departments, setDepartments] = useState<Map<number, string>>(new Map());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [kpisData, topDoctorsData, departmentLoadData, monthlyVisitsData, doctorWorkloadData, doctorsData, departmentsData] =
          await Promise.all([
            analyticsAPI.getKPIs(),
            analyticsAPI.getTopDoctors(),
            analyticsAPI.getDepartmentLoad(),
            analyticsAPI.getMonthlyVisits(),
            analyticsAPI.getDoctorWorkload(),
            doctorAPI.getAll(),
            departmentAPI.getAll(),
          ]);

        // Create lookup maps for doctors and departments
        const doctorMap = new Map<number, string>();
        doctorsData.forEach((doc: Doctor) => {
          doctorMap.set(doc.doctor_id, doc.name);
        });

        const departmentMap = new Map<number, string>();
        departmentsData.forEach((dept: Department) => {
          departmentMap.set(dept.department_id, dept.department_name);
        });

        setKpis(kpisData);
        setTopDoctors(topDoctorsData);
        setDepartmentLoad(departmentLoadData);
        setMonthlyVisits(monthlyVisitsData);
        setDoctorWorkload(doctorWorkloadData);
        setDoctors(doctorMap);
        setDepartments(departmentMap);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load analytics data";
        setError(errorMsg);
        
        // Use mock data for demonstration when API is unavailable
        setKpis({
          total_patients: 245,
          total_doctors: 12,
          total_appointments: 1250,
          total_visits: 850,
        });
        setTopDoctors([
          { doctor_id: 1, total_appointments: 45 },
          { doctor_id: 2, total_appointments: 38 },
          { doctor_id: 3, total_appointments: 32 },
          { doctor_id: 4, total_appointments: 28 },
          { doctor_id: 5, total_appointments: 22 },
        ]);
        setDepartmentLoad([
          { department_id: 1, total_visits: 120 },
          { department_id: 2, total_visits: 95 },
          { department_id: 3, total_visits: 78 },
          { department_id: 4, total_visits: 62 },
        ]);
        setMonthlyVisits([
          { year: 2024, month: 1, total_visits: 45 },
          { year: 2024, month: 2, total_visits: 52 },
          { year: 2024, month: 3, total_visits: 48 },
          { year: 2024, month: 4, total_visits: 61 },
          { year: 2024, month: 5, total_visits: 55 },
        ]);
        setDoctorWorkload([
          { doctor_id: 1, total_visits: 85 },
          { doctor_id: 2, total_visits: 72 },
          { doctor_id: 3, total_visits: 68 },
          { doctor_id: 4, total_visits: 62 },
          { doctor_id: 5, total_visits: 58 },
          { doctor_id: 6, total_visits: 52 },
          { doctor_id: 7, total_visits: 48 },
          { doctor_id: 8, total_visits: 45 },
          { doctor_id: 9, total_visits: 42 },
          { doctor_id: 10, total_visits: 38 },
        ]);
        
        // Create mock lookup maps
        const mockDoctors = new Map<number, string>();
        for (let i = 1; i <= 12; i++) {
          mockDoctors.set(i, `Doctor ${i}`);
        }
        
        const mockDepts = new Map<number, string>();
        mockDepts.set(1, "Cardiology");
        mockDepts.set(2, "Neurology");
        mockDepts.set(3, "Orthopedics");
        mockDepts.set(4, "Pediatrics");
        
        setDoctors(mockDoctors);
        setDepartments(mockDepts);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">HealthCare Pro</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Hospital analytics and insights at a glance
          </p>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/10 mb-8">
            <CardContent className="pt-6">
              <p className="text-destructive font-semibold mb-2">⚠ Backend Connection Issue</p>
              <p className="text-destructive/90 text-sm mb-2">{error}</p>
              <p className="text-destructive/80 text-xs">
                Displaying sample data for demonstration. Please ensure the backend API is running at http://127.0.0.1:8000 or set NEXT_PUBLIC_API_URL environment variable.
              </p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="space-y-8">
            {/* KPI Skeleton */}
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="pt-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>

            {/* Line Chart Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>

            {/* Horizontal Bar Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI Cards Row */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/30 dark:border-blue-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Patients</p>
                      <p className="text-3xl font-bold text-foreground">{kpis?.total_patients || 0}</p>
                    </div>
                    <Users className="h-10 w-10 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/30 dark:border-green-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Doctors</p>
                      <p className="text-3xl font-bold text-foreground">{kpis?.total_doctors || 0}</p>
                    </div>
                    <Stethoscope className="h-10 w-10 text-green-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/30 dark:border-purple-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Appointments</p>
                      <p className="text-3xl font-bold text-foreground">{kpis?.total_appointments || 0}</p>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200/30 dark:border-orange-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Visits</p>
                      <p className="text-3xl font-bold text-foreground">{kpis?.total_visits || 0}</p>
                    </div>
                    <ClipboardList className="h-10 w-10 text-orange-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Top Doctors</CardTitle>
                  <CardDescription>
                    Top 5 doctors by appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopDoctorsChart data={topDoctors} doctors={doctors} />
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Department Load</CardTitle>
                  <CardDescription>
                    Distribution of visits by department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DepartmentLoadChart data={departmentLoad} departments={departments} />
                </CardContent>
              </Card>
            </div>

            {/* Full Width Chart Row 2 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Monthly Visits Trend</CardTitle>
                <CardDescription>
                  Total visits over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyVisitsChart data={monthlyVisits} />
              </CardContent>
            </Card>

            {/* Full Width Chart Row 3 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Doctor Workload</CardTitle>
                <CardDescription>
                  Top 10 doctors by total visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DoctorWorkloadChart data={doctorWorkload} doctors={doctors} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/30 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">HealthCare Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart Healthcare DBMS - Analytics Dashboard
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
