"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
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
} from "@/lib/api";

export default function AnalyticsDashboard() {
  const [topDoctors, setTopDoctors] = useState<TopDoctor[]>([]);
  const [departmentLoad, setDepartmentLoad] = useState<DepartmentLoad[]>([]);
  const [monthlyVisits, setMonthlyVisits] = useState<MonthlyVisit[]>([]);
  const [doctorWorkload, setDoctorWorkload] = useState<DoctorWorkload[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [topDoctorsData, departmentLoadData, monthlyVisitsData, doctorWorkloadData] =
          await Promise.all([
            analyticsAPI.getTopDoctors(),
            analyticsAPI.getDepartmentLoad(),
            analyticsAPI.getMonthlyVisits(),
            analyticsAPI.getDoctorWorkload(),
          ]);

        setTopDoctors(topDoctorsData);
        setDepartmentLoad(departmentLoadData);
        setMonthlyVisits(monthlyVisitsData);
        setDoctorWorkload(doctorWorkloadData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics data");
        console.error("Error fetching analytics:", err);
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
              <p className="text-destructive">{error}</p>
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
