"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { departmentAPI, type Department } from "@/lib/api";

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await departmentAPI.getAll();
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSelectDepartment = (departmentId: number) => {
    router.push(`/patient/doctors?department=${departmentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Departments</h1>
        <p className="text-muted-foreground mt-1">Browse our medical departments and find specialists</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {departments.map((dept) => (
          <Card 
            key={dept.department_id} 
            className="group hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
            onClick={() => handleSelectDepartment(dept.department_id)}
          >
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">{dept.department_name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                View specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                View Doctors
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No departments found</h3>
          <p className="text-muted-foreground">Please check back later</p>
        </div>
      )}
    </div>
  );
}
