import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Student, Attendance } from "@/types";
import { mockClasses } from "@/data/mockData";
import { CheckCircle2, XCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageLoading } from "@/components/StateDisplays";
import { toast } from "sonner";

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, "PRESENT" | "ABSENT">>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const classOptions = mockClasses.map((c) => ({ value: `${c.grade}|${c.section}`, label: `Grade ${c.grade} — Section ${c.section}` }));

  useEffect(() => {
    if (!selectedClass) return;
    const [grade, section] = selectedClass.split("|");
    setLoadingStudents(true);
    api.getStudentsByClass(grade, section).then((s) => {
      setStudents(s);
      const initial: Record<string, "PRESENT" | "ABSENT"> = {};
      s.forEach((st) => { initial[st.id] = "PRESENT"; });
      setAttendance(initial);
      setLoadingStudents(false);
    });
  }, [selectedClass]);

  const toggle = (id: string) => {
    setAttendance((a) => ({ ...a, [id]: a[id] === "PRESENT" ? "ABSENT" : "PRESENT" }));
  };

  const markAll = (status: "PRESENT" | "ABSENT") => {
    const updated: Record<string, "PRESENT" | "ABSENT"> = {};
    students.forEach((s) => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const records: Attendance[] = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      date: selectedDate,
      status,
    }));
    await api.submitAttendance(records);
    setSubmitting(false);
    toast.success("Attendance submitted successfully");
  };

  const presentCount = Object.values(attendance).filter((v) => v === "PRESENT").length;
  const absentCount = Object.values(attendance).filter((v) => v === "ABSENT").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="page-header">Mark Attendance</h1>
        <p className="page-subtitle">Select a class and date to mark attendance.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-foreground mb-1.5">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a class</option>
            {classOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {loadingStudents && <PageLoading />}

      {!loadingStudents && students.length > 0 && (
        <>
          {/* Summary + bulk actions */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-success">{presentCount}</span> present · <span className="font-semibold text-destructive">{absentCount}</span> absent
            </span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => markAll("PRESENT")} className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors">
                Mark All Present
              </button>
              <button onClick={() => markAll("ABSENT")} className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors">
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Student list */}
          <div className="space-y-2">
            {students.map((s) => {
              const status = attendance[s.id];
              const isPresent = status === "PRESENT";
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left",
                    isPresent
                      ? "border-success/30 bg-success/5"
                      : "border-destructive/30 bg-destructive/5"
                  )}
                >
                  {isPresent ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">Roll #{s.rollNo}</p>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                    isPresent ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submit */}
          <div className="sticky bottom-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Attendance
            </button>
          </div>
        </>
      )}

      {!loadingStudents && selectedClass && students.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No students found in this class.</p>
        </div>
      )}
    </div>
  );
}
