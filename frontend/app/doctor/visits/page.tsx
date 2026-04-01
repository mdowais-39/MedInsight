"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { doctorAPI, type RecordVisit } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function RecordVisitPage() {
  const router = useRouter();
  const { userId } = useUserStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [visitId, setVisitId] = useState<number | null>(null);
  
  const [visitData, setVisitData] = useState<RecordVisit>({
    appointment_id: 0,
    patient_id: 0,
    doctor_id: userId || 0,
    diagnosis: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Please login first");
      router.push("/doctor");
      return;
    }

    if (!visitData.appointment_id || !visitData.patient_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await doctorAPI.recordVisit({
        ...visitData,
        doctor_id: userId,
      });

      setVisitId(result.visit_id);
      toast.success("Visit recorded successfully!", {
        description: `Visit ID: ${result.visit_id}. You can now add prescriptions and treatments.`,
      });
    } catch (error) {
      toast.error("Failed to record visit", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVisitId(null);
    setVisitData({
      appointment_id: 0,
      patient_id: 0,
      doctor_id: userId || 0,
      diagnosis: "",
      notes: "",
    });
  };

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">Please Login First</h3>
            <p className="text-muted-foreground mb-4">You need to be logged in to record visits</p>
            <Button onClick={() => router.push("/doctor")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (visitId) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="border-accent">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Visit Recorded Successfully!</h3>
            <p className="text-muted-foreground mt-2">
              Visit ID: <span className="font-bold text-foreground">{visitId}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Save this ID to add prescriptions and treatments
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button onClick={() => router.push(`/doctor/prescriptions?visit=${visitId}`)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Add Prescription
              </Button>
              <Button variant="outline" onClick={() => router.push(`/doctor/treatments?visit=${visitId}`)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Add Treatment
              </Button>
            </div>
            
            <Button variant="ghost" className="mt-4" onClick={handleReset}>
              Record Another Visit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Record Visit</h1>
        <p className="text-muted-foreground mt-1">Document patient visit details and diagnosis</p>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          You need the Appointment ID and Patient ID to record a visit. These IDs are provided when the patient books an appointment.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Visit Details
          </CardTitle>
          <CardDescription>Fill in the visit information for the patient</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment_id">Appointment ID *</Label>
                <Input
                  id="appointment_id"
                  type="number"
                  min="1"
                  placeholder="Enter appointment ID"
                  value={visitData.appointment_id || ""}
                  onChange={(e) => setVisitData({ ...visitData, appointment_id: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient ID *</Label>
                <Input
                  id="patient_id"
                  type="number"
                  min="1"
                  placeholder="Enter patient ID"
                  value={visitData.patient_id || ""}
                  onChange={(e) => setVisitData({ ...visitData, patient_id: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                placeholder="Primary diagnosis (e.g., Mild Hypertension)"
                value={visitData.diagnosis}
                onChange={(e) => setVisitData({ ...visitData, diagnosis: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Clinical Notes *</Label>
              <Textarea
                id="notes"
                placeholder="Detailed notes about the patient's condition, findings, and recommendations"
                rows={5}
                value={visitData.notes}
                onChange={(e) => setVisitData({ ...visitData, notes: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Record Visit
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
