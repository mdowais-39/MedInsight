"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Stethoscope, Calendar, Loader2, Filter, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { departmentAPI, appointmentAPI, type Department, type DoctorInDepartment, type AppointmentBook } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function DoctorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useUserStore();
  
  const [doctors, setDoctors] = useState<DoctorInDepartment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(searchParams.get("department") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorInDepartment | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<number | null>(null);
  
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await departmentAPI.getAll();
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedDepartment) {
        setDoctors([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const docs = await departmentAPI.getDoctors(parseInt(selectedDepartment));
        setDoctors(docs);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedDepartment]);

  const getDepartmentName = (deptId: string) => {
    return departments.find((d) => d.department_id.toString() === deptId)?.department_name || "Unknown";
  };

  const handleBookAppointment = async () => {
    if (!userId) {
      toast.error("Please login first", {
        description: "You need to be logged in to book an appointment",
      });
      router.push("/patient");
      return;
    }

    if (!bookingDoctor) return;

    setIsBooking(true);
    try {
      const appointment: AppointmentBook = {
        patient_id: userId,
        doctor_id: bookingDoctor.doctor_id,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time + ":00", // Add seconds for HH:MM:SS format
      };

      const result = await appointmentAPI.book(appointment);
      setBookingSuccess(result.appointment_id);
      toast.success("Appointment booked!", {
        description: `Appointment ID: ${result.appointment_id}. Your appointment with ${bookingDoctor.name} has been scheduled.`,
      });
    } catch (error) {
      toast.error("Booking failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const closeBookingDialog = () => {
    setBookingDoctor(null);
    setAppointmentData({ date: "", time: "" });
    setBookingSuccess(null);
  };

  if (isLoading && selectedDepartment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Find Doctors</h1>
          <p className="text-muted-foreground mt-1">Select a department to view available doctors</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                  {dept.department_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedDepartment ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">Select a Department</h3>
            <p className="text-muted-foreground">Choose a department from the dropdown to view available doctors</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {selectedDepartment && (
            <Badge variant="outline" className="text-sm px-3 py-1">
              Showing doctors in: {getDepartmentName(selectedDepartment)}
            </Badge>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.doctor_id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-7 w-7 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {doctor.specialization}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Dialog open={bookingDoctor?.doctor_id === doctor.doctor_id} onOpenChange={(open) => !open && closeBookingDialog()}>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setBookingDoctor(doctor)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {bookingSuccess ? (
                        <div className="text-center py-6">
                          <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-accent" />
                          </div>
                          <DialogHeader>
                            <DialogTitle>Appointment Booked!</DialogTitle>
                            <DialogDescription>
                              Your appointment ID is <span className="font-bold text-foreground">{bookingSuccess}</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 p-4 bg-muted rounded-lg text-left">
                            <p className="text-sm text-muted-foreground">Doctor: <span className="font-medium text-foreground">{doctor.name}</span></p>
                            <p className="text-sm text-muted-foreground">Date: <span className="font-medium text-foreground">{appointmentData.date}</span></p>
                            <p className="text-sm text-muted-foreground">Time: <span className="font-medium text-foreground">{appointmentData.time}</span></p>
                          </div>
                          <Button className="w-full mt-6" onClick={closeBookingDialog}>
                            Done
                          </Button>
                        </div>
                      ) : (
                        <>
                          <DialogHeader>
                            <DialogTitle>Book Appointment</DialogTitle>
                            <DialogDescription>
                              Schedule an appointment with {doctor.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="date">Appointment Date</Label>
                              <Input
                                id="date"
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={appointmentData.date}
                                onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="time">Appointment Time</Label>
                              <Input
                                id="time"
                                type="time"
                                value={appointmentData.time}
                                onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                              />
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={handleBookAppointment}
                              disabled={isBooking || !appointmentData.date || !appointmentData.time}
                            >
                              {isBooking ? "Booking..." : "Confirm Booking"}
                            </Button>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {doctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No doctors found</h3>
              <p className="text-muted-foreground">No doctors are currently available in this department</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
