import { useEffect, useState, FormEvent } from "react";
import { api } from "@/services/api";
import { Student } from "@/types";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Modal from "@/components/Modal";
import { FormField, FormActions } from "@/components/FormFields";
import { PageLoading, EmptyState } from "@/components/StateDisplays";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const emptyStudent = { name: "", rollNo: "", class: "", section: "", parentPhone: "" };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyStudent);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  const load = () => {
    setLoading(true);
    api.getStudents().then((s) => { setStudents(s); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.includes(search) ||
    s.class.includes(search)
  );

  const openAdd = () => { setEditing(null); setForm(emptyStudent); setModalOpen(true); };
  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, rollNo: s.rollNo, class: s.class, section: s.section, parentPhone: s.parentPhone });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.updateStudent(editing.id, form);
        toast.success("Student updated successfully");
      } else {
        await api.addStudent(form);
        toast.success("Student added successfully");
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteStudent(id);
    toast.success("Student removed");
    load();
  };

  const setField = (key: string) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Students</h1>
          <p className="page-subtitle">{students.length} students enrolled</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, roll no, or class..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No students found" description="Try adjusting your search or add a new student." />
      ) : isMobile ? (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="mobile-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Roll #{s.rollNo} · Class {s.class}-{s.section}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.parentPhone}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-table">
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Roll No</th>
                <th>Parent Phone</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.class}</td>
                  <td>{s.section}</td>
                  <td>{s.rollNo}</td>
                  <td>{s.parentPhone}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Student" : "Add Student"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormField label="Full Name" value={form.name} onChange={setField("name")} placeholder="Enter student name" />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Class" value={form.class} onChange={setField("class")} placeholder="e.g. 10" />
            <FormField label="Section" value={form.section} onChange={setField("section")} placeholder="e.g. A" />
          </div>
          <FormField label="Roll No" value={form.rollNo} onChange={setField("rollNo")} placeholder="e.g. 101" />
          <FormField label="Parent Phone" value={form.parentPhone} onChange={setField("parentPhone")} placeholder="+91 98765 43210" type="tel" />
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update" : "Add Student"} />
        </form>
      </Modal>
    </div>
  );
}
