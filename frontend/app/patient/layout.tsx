"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Home, Building2, Users, Calendar, LogOut, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";

const navItems = [
  { href: "/patient", icon: Home, label: "Dashboard" },
  { href: "/patient/departments", icon: Building2, label: "Departments" },
  { href: "/patient/doctors", icon: Users, label: "Doctors" },
  { href: "/patient/appointments", icon: Calendar, label: "Appointments" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userName, logout } = useUserStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">HealthCare Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{userName}</span>
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
