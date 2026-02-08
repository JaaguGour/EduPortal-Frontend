import { useEffect, useState, FormEvent } from "react";
import { api } from "@/services/api";
import { ClassSection } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import { FormField, FormActions } from "@/components/FormFields";
import { PageLoading, EmptyState } from "@/components/StateDisplays";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const emptyClass = { grade: "", section: "", classTeacher: "" };

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClassSection | null>(null);
  const [form, setForm] = useState(emptyClass);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  const load = () => {
    setLoading(true);
    api.getClasses().then((c) => { setClasses(c); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyClass); setModalOpen(true); };
  const openEdit = (c: ClassSection) => {
    setEditing(c);
    setForm({ grade: c.grade, section: c.section, classTeacher: c.classTeacher });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.updateClass(editing.id, form);
        toast.success("Class updated successfully");
      } else {
        await api.addClass(form);
        toast.success("Class added successfully");
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteClass(id);
    toast.success("Class removed");
    load();
  };

  const setField = (key: string) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Classes & Sections</h1>
          <p className="page-subtitle">{classes.length} classes configured</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>

      {classes.length === 0 ? (
        <EmptyState title="No classes yet" description="Add your first class to get started." />
      ) : isMobile ? (
        <div className="space-y-3">
          {classes.map((c) => (
            <div key={c.id} className="mobile-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Grade {c.grade} — Section {c.section}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Class Teacher: {c.classTeacher}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
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
                <th>Grade</th>
                <th>Section</th>
                <th>Class Teacher</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium">Grade {c.grade}</td>
                  <td>{c.section}</td>
                  <td>{c.classTeacher}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Class" : "Add Class"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Grade" value={form.grade} onChange={setField("grade")} placeholder="e.g. 10" />
            <FormField label="Section" value={form.section} onChange={setField("section")} placeholder="e.g. A" />
          </div>
          <FormField label="Class Teacher" value={form.classTeacher} onChange={setField("classTeacher")} placeholder="Teacher name" />
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update" : "Add Class"} />
        </form>
      </Modal>
    </div>
  );
}
