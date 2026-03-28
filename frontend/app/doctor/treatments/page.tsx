"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Syringe, Plus, Loader2, Trash2, CheckCircle2, Home } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { doctorAPI, type AddTreatment } from "@/lib/api";
import { useUserStore } from "@/lib/store";

interface TreatmentForm {
  treatment_type: string;
  cost: number;
  notes: string;
}

const treatmentTypes = [
  "Physical Therapy",
  "Surgery",
  "Blood Test",
  "X-Ray",
  "MRI Scan",
  "CT Scan",
  "Ultrasound",
  "ECG",
  "Blood Pressure Monitoring",
  "Vaccination",
  "Wound Dressing",
  "IV Therapy",
  "Chemotherapy",
  "Radiation Therapy",
  "Dialysis",
  "Counseling",
  "Other",
];

export default function TreatmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useUserStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visitId, setVisitId] = useState<string>(searchParams.get("visit") || "");
  const [treatments, setTreatments] = useState<TreatmentForm[]>([
    { treatment_type: "", cost: 0, notes: "" },
  ]);

  const addTreatment = () => {
    setTreatments([
      ...treatments,
      { treatment_type: "", cost: 0, notes: "" },
    ]);
  };

  const removeTreatment = (index: number) => {
    if (treatments.length > 1) {
      setTreatments(treatments.filter((_, i) => i !== index));
    }
  };

  const updateTreatment = (index: number, field: keyof TreatmentForm, value: string | number) => {
    const updated = [...treatments];
    updated[index] = { ...updated[index], [field]: value };
    setTreatments(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitId) {
      toast.error("Please enter a visit ID");
      return;
    }

    const validTreatments = treatments.filter(
      (t) => t.treatment_type && t.notes
    );

    if (validTreatments.length === 0) {
      toast.error("Please add at least one complete treatment");
      return;
    }

    setIsLoading(true);

    try {
      for (const tx of validTreatments) {
        const treatment: AddTreatment = {
          visit_id: parseInt(visitId),
          treatment_type: tx.treatment_type,
          cost: tx.cost || 0,
          notes: tx.notes,
        };
        await doctorAPI.addTreatment(treatment);
      }

      setSuccess(true);
      toast.success("Treatments added successfully!", {
        description: `${validTreatments.length} treatment(s) saved`,
      });
    } catch (error) {
      toast.error("Failed to add treatments", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setVisitId("");
    setTreatments([{ treatment_type: "", cost: 0, notes: "" }]);
  };

  if (!userId) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Syringe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">Please Login First</h3>
            <p className="text-muted-foreground mb-4">You need to be logged in to add treatments</p>
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
            <h3 className="text-xl font-bold text-foreground">Treatments Added!</h3>
            <p className="text-muted-foreground mt-2">
              {treatments.filter(t => t.treatment_type).length} treatment(s) added to Visit ID: {visitId}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button onClick={() => router.push("/doctor")}>
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Add More Treatments
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
        <h1 className="text-3xl font-bold text-foreground">Add Treatments</h1>
        <p className="text-muted-foreground mt-1">Record treatment plans for patient visits</p>
      </div>

      <Alert>
        <Syringe className="h-4 w-4" />
        <AlertDescription>
          You need the Visit ID to add treatments. The Visit ID is provided when you record a visit.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-accent" />
            Treatment Details
          </CardTitle>
          <CardDescription>Add one or more treatments for the visit</CardDescription>
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

            {/* Treatments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Treatments</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTreatment}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another
                </Button>
              </div>

              {treatments.map((tx, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Treatment {index + 1}
                      </span>
                      {treatments.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTreatment(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Treatment Type *</Label>
                        <Select
                          value={tx.treatment_type}
                          onValueChange={(value) => updateTreatment(index, "treatment_type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {treatmentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Cost *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g., 150.00"
                          value={tx.cost || ""}
                          onChange={(e) => updateTreatment(index, "cost", parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes *</Label>
                      <Textarea
                        placeholder="Describe the treatment, procedure details, and any special instructions"
                        value={tx.notes}
                        onChange={(e) => updateTreatment(index, "notes", e.target.value)}
                        rows={3}
                        required
                      />
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
                  <Syringe className="h-4 w-4 mr-2" />
                  Save Treatments
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
