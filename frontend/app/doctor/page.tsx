"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, LogIn, Calendar, FileText, Pill, Syringe, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { doctorAPI, departmentAPI, type DoctorRegister, type Department } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function DoctorDashboard() {
  const router = useRouter();
  const { userId, userName, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState<DoctorRegister>({
    name: "",
    specialization: "",
    department_id: 0,
    experience_years: 0,
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await departmentAPI.getAll();
        setDepartments(depts);
      } catch {
        console.error("Failed to fetch departments. Make sure the backend is running.");
      }
    };

    fetchDepartments();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await doctorAPI.register(formData);
      toast.success("Registration successful!", {
        description: `Welcome Dr. ${formData.name}! Your doctor ID is ${result.doctor_id}. Please save this ID for future logins.`,
      });
      setUser("doctor", result.doctor_id, formData.name);
      router.push("/doctor/visits");
    } catch (error) {
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const doctorId = parseInt(loginId);
    if (isNaN(doctorId) || doctorId <= 0) {
      toast.error("Invalid Doctor ID", {
        description: "Please enter a valid doctor ID",
      });
      return;
    }
    setIsLoading(true);
    try {
      const doctor = await doctorAPI.getById(doctorId);
      setUser("doctor", doctor.doctor_id, doctor.name);
      toast.success("Welcome back!", {
        description: `Logged in as Dr. ${doctor.name} (ID: ${doctorId})`,
      });
      router.push("/doctor/visits");
    } catch {
      toast.error("Doctor not found", {
        description: "No doctor registered with that ID. Please check your ID or register first.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If already logged in, show dashboard
  if (userId && userName) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, Dr. {userName}</h1>
          <p className="text-muted-foreground mt-1">Your Doctor ID: {userId}</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Remember your Doctor ID ({userId}) for future logins. Use it to manage patient visits, prescriptions, and treatments.
          </AlertDescription>
        </Alert>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:border-accent/50"
              onClick={() => router.push("/doctor/visits")}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-base">Record Visit</CardTitle>
                <CardDescription className="text-sm">Document patient visit with diagnosis and notes</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:border-accent/50"
              onClick={() => router.push("/doctor/prescriptions")}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                  <Pill className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-base">Add Prescription</CardTitle>
                <CardDescription className="text-sm">Prescribe medications for patient visits</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:border-accent/50"
              onClick={() => router.push("/doctor/treatments")}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                  <Syringe className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-base">Add Treatment</CardTitle>
                <CardDescription className="text-sm">Record treatment plans and costs</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Workflow Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Doctor Workflow
            </CardTitle>
            <CardDescription>Follow these steps to manage patient visits</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span>
                <div>
                  <p className="font-medium text-foreground">Record Visit</p>
                  <p className="text-sm text-muted-foreground">Enter appointment ID, patient ID, diagnosis, and notes</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span>
                <div>
                  <p className="font-medium text-foreground">Add Prescription</p>
                  <p className="text-sm text-muted-foreground">Use the visit ID to add medications</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span>
                <div>
                  <p className="font-medium text-foreground">Add Treatment</p>
                  <p className="text-sm text-muted-foreground">Use the visit ID to record treatments and costs</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Doctor Portal</h1>
        <p className="text-muted-foreground mt-2">Register or login to access your dashboard</p>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Register
          </TabsTrigger>
          <TabsTrigger value="login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Registration</CardTitle>
              <CardDescription>Create your doctor profile to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="Cardiologist"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department_id?.toString() || ""}
                    onValueChange={(value) => setFormData({ ...formData, department_id: parseInt(value) })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
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

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={formData.experience_years || ""}
                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Login</CardTitle>
              <CardDescription>Enter your doctor ID to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorId">Doctor ID</Label>
                  <Input
                    id="doctorId"
                    type="number"
                    placeholder="Enter your doctor ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
