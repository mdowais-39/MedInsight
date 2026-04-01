"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AnalyticsFilters,
} from "@/lib/api";

// Month names for display
const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Generate year options (last 5 years)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

export default function AnalyticsDashboard() {
  // Analytics data state
  const [topDoctors, setTopDoctors] = useState<TopDoctor[]>([]);
  const [departmentLoad, setDepartmentLoad] = useState<DepartmentLoad[]>([]);
  const [monthlyVisits, setMonthlyVisits] = useState<MonthlyVisit[]>([]);
  const [doctorWorkload, setDoctorWorkload] = useState<DoctorWorkload[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state (isolated to this page only)
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "doctor">("admin");
  const [doctorId, setDoctorId] = useState<string>("");

  // Build filters object from current state
  const buildFilters = useCallback((): AnalyticsFilters => {
    const filters: AnalyticsFilters = {};
    if (selectedYear) filters.year = parseInt(selectedYear);
    if (selectedMonth) filters.month = parseInt(selectedMonth);
    if (selectedRole) filters.role = selectedRole;
    if (selectedRole === "doctor" && doctorId) {
      filters.doctor_id = parseInt(doctorId);
    }
    return filters;
  }, [selectedYear, selectedMonth, selectedRole, doctorId]);

  // Fetch analytics data with current filters
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = buildFilters();

      const [topDoctorsData, departmentLoadData, monthlyVisitsData, doctorWorkloadData] =
        await Promise.all([
          analyticsAPI.getTopDoctorsFiltered(filters),
          analyticsAPI.getDepartmentLoadFiltered(filters),
          analyticsAPI.getMonthlyVisitsFiltered(filters),
          analyticsAPI.getDoctorWorkloadFiltered(filters),
        ]);

      setTopDoctors(topDoctorsData);
      setDepartmentLoad(departmentLoadData);
      setMonthlyVisits(monthlyVisitsData);
      setDoctorWorkload(doctorWorkloadData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load analytics data";
      setError(errorMsg);
      
      // Use mock data for demonstration when API is unavailable
      setTopDoctors([
        { doctor_id: 1, total_appointments: 45 },
        { doctor_id: 2, total_appointments: 38 },
        { doctor_id: 3, total_appointments: 32 },
      ]);
      setDepartmentLoad([
        { department_id: 1, total_visits: 120 },
        { department_id: 2, total_visits: 95 },
        { department_id: 3, total_visits: 78 },
      ]);
      setMonthlyVisits([
        { year: 2024, month: 1, total_visits: 45 },
        { year: 2024, month: 2, total_visits: 52 },
        { year: 2024, month: 3, total_visits: 48 },
      ]);
      setDoctorWorkload([
        { doctor_id: 1, total_visits: 85 },
        { doctor_id: 2, total_visits: 72 },
        { doctor_id: 3, total_visits: 68 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [buildFilters]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Clear doctor_id when role changes to admin
  useEffect(() => {
    if (selectedRole === "admin") {
      setDoctorId("");
    }
  }, [selectedRole]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedRole("admin");
    setDoctorId("");
  };

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

        {/* Filter Section */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>
              Filter analytics data by time period and role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Year Filter */}
              <div className="space-y-2">
                <Label htmlFor="year-filter">Year</Label>
                <Select value={selectedYear || "all"} onValueChange={(v) => setSelectedYear(v === "all" ? "" : v)}>
                  <SelectTrigger id="year-filter">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {YEARS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Month Filter */}
              <div className="space-y-2">
                <Label htmlFor="month-filter">Month</Label>
                <Select value={selectedMonth || "all"} onValueChange={(v) => setSelectedMonth(v === "all" ? "" : v)}>
                  <SelectTrigger id="month-filter">
                    <SelectValue placeholder="All Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <Label htmlFor="role-filter">Role</Label>
                <Select value={selectedRole} onValueChange={(value: "admin" | "doctor") => setSelectedRole(value)}>
                  <SelectTrigger id="role-filter">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Data)</SelectItem>
                    <SelectItem value="doctor">Doctor (Specific)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Doctor ID Filter (only shown when role is doctor) */}
              <div className="space-y-2">
                <Label htmlFor="doctor-id-filter">Doctor ID</Label>
                <Input
                  id="doctor-id-filter"
                  type="number"
                  placeholder="Enter Doctor ID"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  disabled={selectedRole !== "doctor"}
                  className={selectedRole !== "doctor" ? "opacity-50" : ""}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => fetchAnalyticsData()}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedYear || selectedMonth || selectedRole === "doctor") && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Active Filters:</span>{" "}
                  {selectedRole === "doctor" && doctorId && `Doctor ID: ${doctorId}`}
                  {selectedRole === "doctor" && doctorId && (selectedYear || selectedMonth) && " | "}
                  {selectedYear && `Year: ${selectedYear}`}
                  {selectedYear && selectedMonth && ", "}
                  {selectedMonth && `Month: ${MONTHS.find(m => m.value === selectedMonth)?.label}`}
                  {selectedRole === "admin" && !selectedYear && !selectedMonth && "None (showing all data)"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
            {/* Top Row Skeleton */}
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

            {/* Middle Row Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>

            {/* Bottom Row Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Top Doctors</CardTitle>
                  <CardDescription>
                    Doctors with the most appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopDoctorsChart data={topDoctors} />
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Department Load</CardTitle>
                  <CardDescription>
                    Total visits per department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DepartmentLoadChart data={departmentLoad} />
                </CardContent>
              </Card>
            </div>

            {/* Middle Row */}
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

            {/* Bottom Row */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Doctor Workload</CardTitle>
                <CardDescription>
                  Total visits handled by each doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DoctorWorkloadChart data={doctorWorkload} />
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
