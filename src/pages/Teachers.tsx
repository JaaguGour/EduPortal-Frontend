import { useEffect, useState, FormEvent } from "react";
import { api } from "@/services/api";
import { Teacher } from "@/types";
import { Plus, Pencil, Trash2, Search, BookOpen } from "lucide-react";
import Modal from "@/components/Modal";
import { FormField, FormActions } from "@/components/FormFields";
import { PageLoading, EmptyState } from "@/components/StateDisplays";
import { toast } from "sonner";

const emptyTeacher = { name: "", subject: "", assignedClass: "" };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyTeacher);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getTeachers().then((t) => { setTeachers(t); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyTeacher); setModalOpen(true); };
  const openEdit = (t: Teacher) => {
    setEditing(t);
    setForm({ name: t.name, subject: t.subject, assignedClass: t.assignedClass });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.updateTeacher(editing.id, form);
        toast.success("Teacher updated successfully");
      } else {
        await api.addTeacher(form);
        toast.success("Teacher added successfully");
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteTeacher(id);
    toast.success("Teacher removed");
    load();
  };

  const setField = (key: string) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Teachers</h1>
          <p className="page-subtitle">{teachers.length} faculty members</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or subject..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No teachers found" description="Try adjusting your search or add a new teacher." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="mobile-card flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.subject}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Class {t.assignedClass}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Teacher" : "Add Teacher"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormField label="Full Name" value={form.name} onChange={setField("name")} placeholder="Enter teacher name" />
          <FormField label="Subject" value={form.subject} onChange={setField("subject")} placeholder="e.g. Mathematics" />
          <FormField label="Assigned Class" value={form.assignedClass} onChange={setField("assignedClass")} placeholder="e.g. 10-A" />
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update" : "Add Teacher"} />
        </form>
      </Modal>
    </div>
  );
}
