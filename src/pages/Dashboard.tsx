import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Activity } from "@/types";
import { Users, GraduationCap, School, ClipboardCheck, TrendingUp, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendancePercent: number;
}

const kpiConfig = [
  { key: "totalStudents" as const, label: "Total Students", icon: Users, color: "text-primary bg-primary/10" },
  { key: "totalTeachers" as const, label: "Total Teachers", icon: GraduationCap, color: "text-success bg-success/10" },
  { key: "totalClasses" as const, label: "Total Classes", icon: School, color: "text-info bg-info/10" },
  { key: "attendancePercent" as const, label: "Today's Attendance", icon: ClipboardCheck, color: "text-warning bg-warning/10", suffix: "%" },
];

const activityIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
};

const activityColors = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboardStats(), api.getRecentActivity()]).then(([s, a]) => {
      setStats(s);
      setActivities(a);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="page-header">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your school overview.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="kpi-card animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-muted" />
              <div className="mt-3 h-8 w-16 rounded bg-muted" />
              <div className="mt-1 h-4 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your school overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiConfig.map((kpi) => {
          const Icon = kpi.icon;
          const value = stats?.[kpi.key] ?? 0;
          return (
            <div key={kpi.key} className="kpi-card group hover:border-primary/20 transition-colors">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground tracking-tight">
                {value}{kpi.suffix || ""}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Activity</h2>
          <span className="text-xs text-muted-foreground">{activities.length} events</span>
        </div>
        <div className="divide-y divide-border">
          {activities.map((a) => {
            const Icon = activityIcons[a.type];
            return (
              <div key={a.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-accent/30 transition-colors">
                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", activityColors[a.type])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{a.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
