"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { appointmentAPI, type PatientAppointment } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function AppointmentsPage() {
  const router = useRouter();
  const { userId } = useUserStore();
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAppointments = async () => {
      try {
        const data = await appointmentAPI.getByPatient(userId);
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">Please Login First</h3>
            <p className="text-muted-foreground mb-4">You need to be logged in to view appointments</p>
            <Button onClick={() => router.push("/patient")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled": return "default";
      case "completed": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted-foreground mt-1">Your Patient ID: {userId}</p>
        </div>
        <Button onClick={() => router.push("/patient/doctors")}>
          <Calendar className="h-4 w-4 mr-2" />
          Book New Appointment
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="py-4 text-destructive text-sm">
            {error}. Make sure the backend server is running.
          </CardContent>
        </Card>
      )}

      {appointments.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Appointments Yet</h3>
            <p className="text-muted-foreground mb-4">You haven&apos;t booked any appointments</p>
            <Button onClick={() => router.push("/patient/departments")}>Browse Departments</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((apt) => (
            <Card key={apt.appointment_id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Appointment #{apt.appointment_id}</CardTitle>
                  <Badge variant={statusColor(apt.status)}>{apt.status}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {apt.doctor_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {apt.appointment_date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {apt.appointment_time}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
