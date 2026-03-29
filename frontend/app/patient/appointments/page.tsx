"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, Clock, User, ChevronDown, ChevronUp, FileText, Pill, Syringe, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { appointmentAPI, type PatientDetailedAppointment } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function AppointmentsPage() {
  const router = useRouter();
  const { userId } = useUserStore();
  const [detailedAppointments, setDetailedAppointments] = useState<PatientDetailedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAppointments, setExpandedAppointments] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!userId) return;

    const fetchDetailedAppointments = async () => {
      try {
        const data = await appointmentAPI.getDetailedByPatient(userId);
        setDetailedAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedAppointments();
  }, [userId]);

  const toggleAppointment = (appointmentId: number) => {
    setExpandedAppointments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
      } else {
        newSet.add(appointmentId);
      }
      return newSet;
    });
  };

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
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground mt-1">Your Patient ID: {userId}</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
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

      {detailedAppointments.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Appointments Yet</h3>
            <p className="text-muted-foreground mb-4">You haven&apos;t booked any appointments</p>
            <Button onClick={() => router.push("/patient/departments")}>Browse Departments</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {detailedAppointments.map((apt) => (
            <Card key={apt.appointment_id} className="hover:shadow-md transition-all">
              <Collapsible
                open={expandedAppointments.has(apt.appointment_id)}
                onOpenChange={() => toggleAppointment(apt.appointment_id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">Appointment #{apt.appointment_id}</CardTitle>
                      <Badge variant={statusColor(apt.status)}>{apt.status}</Badge>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {expandedAppointments.has(apt.appointment_id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        <span className="ml-1 text-sm">
                          {expandedAppointments.has(apt.appointment_id) ? "Hide Details" : "View Details"}
                        </span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      Dr. {apt.doctor_name}
                    </span>
                    {apt.doctor_specialization && (
                      <span className="flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" />
                        {apt.doctor_specialization}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {apt.appointment_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {apt.appointment_time}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {apt.visit ? (
                      <>
                        {/* Visit Info */}
                        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Visit Information
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Diagnosis:</span>
                              <p className="font-medium text-foreground">{apt.visit.diagnosis || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Visit Date:</span>
                              <p className="font-medium text-foreground">{apt.visit.visit_date || "N/A"}</p>
                            </div>
                            {apt.visit.notes && (
                              <div className="sm:col-span-2">
                                <span className="text-muted-foreground">Notes:</span>
                                <p className="font-medium text-foreground">{apt.visit.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Prescriptions */}
                        {apt.visit.prescriptions && apt.visit.prescriptions.length > 0 && (
                          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                              <Pill className="h-4 w-4 text-primary" />
                              Prescriptions
                            </h4>
                            <div className="space-y-2">
                              {apt.visit.prescriptions.map((prescription) => (
                                <div key={prescription.prescription_id} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm bg-background rounded-md p-2">
                                  <span className="font-medium text-foreground">{prescription.medicine_name}</span>
                                  <span className="text-muted-foreground">Dosage: {prescription.dosage}</span>
                                  <span className="text-muted-foreground">Duration: {prescription.duration_days} days</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Treatments */}
                        {apt.visit.treatments && apt.visit.treatments.length > 0 && (
                          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                              <Syringe className="h-4 w-4 text-primary" />
                              Treatments
                            </h4>
                            <div className="space-y-2">
                              {apt.visit.treatments.map((treatment) => (
                                <div key={treatment.treatment_id} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm bg-background rounded-md p-2">
                                  <span className="font-medium text-foreground">{treatment.treatment_type}</span>
                                  <span className="text-muted-foreground">Cost: ${treatment.treatment_cost}</span>
                                  {treatment.treatment_notes && (
                                    <span className="text-muted-foreground">Notes: {treatment.treatment_notes}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-muted-foreground text-sm">No visit details recorded yet for this appointment</p>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
