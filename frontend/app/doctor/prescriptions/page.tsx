"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pill, Plus, Loader2, Trash2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { doctorAPI, type AddPrescription } from "@/lib/api";
import { useUserStore } from "@/lib/store";

interface PrescriptionForm {
  medicine_name: string;
  dosage: string;
  duration_days: number;
}

export default function PrescriptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useUserStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visitId, setVisitId] = useState<string>(searchParams.get("visit") || "");
  const [prescriptions, setPrescriptions] = useState<PrescriptionForm[]>([
    { medicine_name: "", dosage: "", duration_days: 0 },
  ]);

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine_name: "", dosage: "", duration_days: 0 },
    ]);
  };

  const removePrescription = (index: number) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prescriptions.filter((_, i) => i !== index));
    }
  };

  const updatePrescription = (index: number, field: keyof PrescriptionForm, value: string | number) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitId) {
      toast.error("Please enter a visit ID");
      return;
    }

    const validPrescriptions = prescriptions.filter(
      (p) => p.medicine_name && p.dosage && p.duration_days > 0
    );

    if (validPrescriptions.length === 0) {
      toast.error("Please add at least one complete prescription");
      return;
    }

    setIsLoading(true);

    try {
      for (const rx of validPrescriptions) {
        const prescription: AddPrescription = {
          visit_id: parseInt(visitId),
          medicine_name: rx.medicine_name,
          dosage: rx.dosage,
          duration_days: rx.duration_days,
        };
        await doctorAPI.addPrescription(prescription);
      }

      setSuccess(true);
      toast.success("Prescriptions added successfully!", {
        description: `${validPrescriptions.length} prescription(s) saved`,
      });
    } catch (error) {
      toast.error("Failed to add prescriptions", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setVisitId("");
    setPrescriptions([{ medicine_name: "", dosage: "", duration_days: 0 }]);
  };

  if (!userId) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">Please Login First</h3>
            <p className="text-muted-foreground mb-4">You need to be logged in to add prescriptions</p>
            <Button onClick={() => router.push("/doctor")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="border-accent">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Prescriptions Added!</h3>
            <p className="text-muted-foreground mt-2">
              {prescriptions.filter(p => p.medicine_name).length} prescription(s) added to Visit ID: {visitId}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button onClick={() => router.push(`/doctor/treatments?visit=${visitId}`)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Add Treatment
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Add More Prescriptions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Prescriptions</h1>
        <p className="text-muted-foreground mt-1">Prescribe medications for patient visits</p>
      </div>

      <Alert>
        <Pill className="h-4 w-4" />
        <AlertDescription>
          You need the Visit ID to add prescriptions. The Visit ID is provided when you record a visit.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-accent" />
            Prescription Details
          </CardTitle>
          <CardDescription>Add one or more prescriptions for the visit</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit ID */}
            <div className="space-y-2">
              <Label htmlFor="visit_id">Visit ID *</Label>
              <Input
                id="visit_id"
                type="number"
                min="1"
                placeholder="Enter the visit ID"
                value={visitId}
                onChange={(e) => setVisitId(e.target.value)}
                required
              />
            </div>

            {/* Prescriptions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Medications</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPrescription}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another
                </Button>
              </div>

              {prescriptions.map((rx, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Medication {index + 1}
                      </span>
                      {prescriptions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePrescription(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Medicine Name *</Label>
                      <Input
                        placeholder="e.g., Amoxicillin 500mg"
                        value={rx.medicine_name}
                        onChange={(e) => updatePrescription(index, "medicine_name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dosage *</Label>
                        <Input
                          placeholder="e.g., 1 tablet twice daily"
                          value={rx.dosage}
                          onChange={(e) => updatePrescription(index, "dosage", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (days) *</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="e.g., 7"
                          value={rx.duration_days || ""}
                          onChange={(e) => updatePrescription(index, "duration_days", parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !visitId}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pill className="h-4 w-4 mr-2" />
                  Save Prescriptions
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
