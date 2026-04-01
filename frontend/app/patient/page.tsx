"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, LogIn, Building2, Calendar, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { patientAPI, type PatientRegister } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function PatientDashboard() {
  const router = useRouter();
  const { userId, userName, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loginId, setLoginId] = useState("");

  const [formData, setFormData] = useState<PatientRegister>({
    name: "",
    age: 0,
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await patientAPI.register(formData);
      toast.success("Registration successful!", {
        description: `Welcome ${formData.name}! Your patient ID is ${result.patient_id}. Please save this ID for future logins.`,
      });
      setUser("patient", result.patient_id, formData.name);
      router.push("/patient/departments");
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
    const patientId = parseInt(loginId);
    if (isNaN(patientId) || patientId <= 0) {
      toast.error("Invalid Patient ID", {
        description: "Please enter a valid patient ID",
      });
      return;
    }
    setIsLoading(true);
    try {
      const patient = await patientAPI.getById(patientId);
      setUser("patient", patient.patient_id, patient.name);
      toast.success("Welcome back!", {
        description: `Logged in as ${patient.name} (ID: ${patientId})`,
      });
      router.push("/patient/departments");
    } catch {
      toast.error("Patient not found", {
        description: "No patient registered with that ID. Please check your ID or register first.",
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
          <h1 className="text-3xl font-bold text-foreground">Welcome, {userName}</h1>
          <p className="text-muted-foreground mt-1">Your Patient ID: {userId}</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Remember your Patient ID ({userId}) for future logins. You will need it to access your appointments.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
            onClick={() => router.push("/patient/departments")}
          >
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Browse Departments</CardTitle>
              <CardDescription>Explore medical departments and find specialists</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
            onClick={() => router.push("/patient/doctors")}
          >
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Find Doctors</CardTitle>
              <CardDescription>View available doctors and book appointments</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
            onClick={() => router.push("/patient/appointments")}
          >
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>View your booked appointments</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Patient Portal</h1>
        <p className="text-muted-foreground mt-2">Register or login to access your healthcare dashboard</p>
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
              <CardTitle>New Patient Registration</CardTitle>
              <CardDescription>Create your patient profile to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="30"
                      value={formData.age || ""}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Your full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              <CardTitle>Patient Login</CardTitle>
              <CardDescription>Enter your patient ID to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    type="number"
                    placeholder="Enter your patient ID"
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
