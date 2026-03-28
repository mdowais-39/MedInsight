"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Home, FileText, Pill, Syringe, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";

const navItems = [
  { href: "/doctor", icon: Home, label: "Dashboard" },
  { href: "/doctor/visits", icon: FileText, label: "Record Visit" },
  { href: "/doctor/prescriptions", icon: Pill, label: "Prescriptions" },
  { href: "/doctor/treatments", icon: Syringe, label: "Treatments" },
];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userName, logout } = useUserStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-sidebar sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">HealthCare Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm text-sidebar-foreground/70">
                Dr. <span className="font-medium text-sidebar-foreground">{userName}</span>
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-sidebar-border bg-sidebar/95">
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
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
