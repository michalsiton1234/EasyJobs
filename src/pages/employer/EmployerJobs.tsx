import { useState, useEffect } from "react";
import { api } from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "@/lib/AuthContext";
import type { RootState } from "@/store";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Pencil,
  Trash2,
  LayoutDashboard,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import type { JobListing } from "@/models/JobListing";
import { employerAPI } from "@/api/EmployerApi";
import "./EmployerJobs.css";

export default function EmployerJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: number, name: string, icon: string }[]>([]);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employer, setEmployer] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    payment: 35,
    level: "easy",
    is_remote: false,
    is_job_with_people: false,
    is_catch: false,
    categoryIds: [] as number[],
  });

  const { isLoading: authLoading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchEmployerData = async () => {
      const userId = user?.id ? parseInt(user.id) : null;
      if (userId && userId > 0) {
        try {
          const data = await employerAPI.getByUserId(userId);
          setEmployer(data);
        } catch (err) {
          console.error("שגיאה בשליפת מעסיק:", err);
        }
      }
    };

    if (!authLoading) {
      fetchEmployerData();
    }
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (employer?.id) {
      loadJobs();
    }
  }, [employer?.id]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/Category");
      const categoryIcons: { [key: string]: string } = {
        "ביביסיטר": "👶", "משלוחים": "📦", "ניקיון": "🧹",
        "קלדנות": "⌨️", "סטודנט": "📚", "מרחוק": "🏠",
        "אחר": "✨", "שירות": "🎧"
      };

      const mappedCategories = res.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: categoryIcons[cat.name] || "📋"
      }));
      setCategories(mappedCategories);
    } catch (err) {
      toast.error("שגיאה בטעינת קטגוריות");
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/JobListing/getByEmp/${employer.id}`);
      setJobs(res.data);
    } catch (err) {
      toast.error("שגיאה בטעינת משרות");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      payment: 35,
      level: "easy",
      categoryIds: [],
      is_remote: false,
      is_job_with_people: false,
      is_catch: false,
    });
    setEditingJob(null);
  };

  const handleEdit = (job: JobListing) => {
    setEditingJob(job);
    const loadedCategoryIds = job.categoryIds || (job.categoryId ? [job.categoryId] : []);

    setForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      payment: job.payment || 35,
      level: job.leveJob === 0 ? "easy" : job.leveJob === 1 ? "medium" : "hard",
      categoryIds: Array.isArray(loadedCategoryIds) ? loadedCategoryIds : [loadedCategoryIds],
      is_remote: Boolean(job.isRemote),
      is_job_with_people: Boolean(job.isJobWithPepole),
      is_catch: Boolean(job.isCatch),
    });
    setDialogOpen(true);
  };

const handleSave = async () => {
  try {
    if (!employer?.id) {
      toast.error("מזהה מעסיק לא נמצא");
      return;
    }
    
    const firstCategoryId = form.categoryIds?.[0];
    if (!firstCategoryId) {
      toast.error("יש לבחור קטגוריה");
      return;
    }

    // המרה לערך מספרי עבור ה-Enum (elevel)
    const levelValue = form.level === "easy" ? 0 : form.level === "medium" ? 1 : 2;
debugger
    // בניית האובייקט בדיוק לפי ה-JobListingsDto ששלחת
    const jobData = {
      Id: editingJob ? Number(editingJob.id) : 0,
      EmployerId: Number(employer.id),
      CategoryId: Number(firstCategoryId),
      Title: form.title,
      Description: form.description,
      Location: form.location,
      Payment: Number(form.payment),
      RequiredDate: editingJob?.requiredDate || new Date().toISOString(),
      IsCatch: Boolean(form.is_catch),
      IsRemote: Boolean(form.is_remote),
      IsJobWithPepole: Boolean(form.is_job_with_people), // איות: Pepole (לפי ה-DTO שלך)
      leveJob: levelValue, // אות קטנה l לפי ה-DTO שלך!
    };

    console.log("Payload being sent:", jobData);

    if (editingJob) {
      // עדכון - שים לב לשימוש ב-ID בנתיב ובגוף
      const response = await api.put(`/JobListing/${editingJob.id}`, jobData);
      console.log("Server response:", response.data);
      toast.success("המשרה עודכנה בהצלחה");
    } else {
      // יצירה
      await api.post("/JobListing", jobData);
      toast.success("המשרה פורסמה בהצלחה");
    }

    setDialogOpen(false);
    resetForm();
    await loadJobs(); // רענון הרשימה מהשרת
    
  } catch (err: any) {
    console.error("FULL ERROR OBJECT:", err);
    if (err.response?.data?.errors) {
      // זה יציג לך בדיוק איזה שדה נכשל בולידציה בשרת
      const validationErrors = Object.values(err.response.data.errors).flat().join(", ");
      toast.error(`שגיאת שרת: ${validationErrors}`);
    } else {
      toast.error(err.response?.data || "שגיאה בתקשורת עם השרת");
    }
  }
};
  const handleDelete = async (id: number) => {
    if (!confirm("למחוק את המשרה?")) return;
    try {
      await api.delete(`/JobListing/${id}`);
      toast.success("נמחק בהצלחה");
      loadJobs();
    } catch {
      toast.error("שגיאה במחיקה");
    }
  };

  if (authLoading || (loading && !jobs.length && employer)) {
    return (
      <div className="loader-container">
        <div className="text-center">
          <div className="spinner" />
          <p className="text-white text-sm">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <div className="header-section">
        <div>
          <h1 className="text-3xl font-bold text-white">ניהול משרות</h1>
          <p className="text-white/60">שלום, {user?.name || 'מעסיק'}</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/employer/matches')} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg text-white">
            <LayoutDashboard size={18} /> לוח מנהל
          </button>
          <button onClick={() => { resetForm(); setDialogOpen(true); }} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg text-white">
            <Plus size={18} /> משרה חדשה
          </button>
        </div>
      </div>

      <div className="job-grid">
        {jobs.map((job) => (
          <motion.div key={job.id} className="job-card" layout>
            <div className="flex justify-between mb-3">
              <span className="status-badge">פתוחה</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(job)} className="text-white/60 hover:text-cyan-400"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(job.id)} className="text-white/60 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">{job.title}</h3>
            <p className="text-white/60 text-sm mt-2 line-clamp-2">{job.description}</p>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2"><MapPin size={14} /> {job.location}</div>
              <div className="flex items-center gap-2"><DollarSign size={14} /> {job.payment} ₪</div>
              <div className="flex items-center gap-2"><Briefcase size={14} /> {job.isRemote ? "עבודה מרחוק" : "מיקום פיזי"}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F172A] text-white border-white/10 max-w-md max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingJob ? "עריכת משרה" : "משרה חדשה"}</DialogTitle>
            <DialogDescription>מלאו את פרטי המשרה שתוצג למחפשי עבודה</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-300">כותרת המשרה</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-white/5 border-white/10" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-300">תיאור</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10 min-h-[80px]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-300">עיר</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-300">שכר לשעה</Label>
                <Input type="number" value={form.payment} onChange={(e) => setForm({ ...form, payment: Number(e.target.value) })} className="bg-white/5 border-white/10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-300">רמת קושי</Label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-md h-10 px-3">
                <option value="easy">קלה</option>
                <option value="medium">בינונית</option>
                <option value="hard">קשה</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-300">עבודה מרחוק</span>
              <Switch
                checked={form.is_remote}
                onCheckedChange={(v) => setForm({ ...form, is_remote: v })}
              />
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-300">עבודה עם אנשים</span>
              <Switch
                checked={form.is_job_with_people}
                onCheckedChange={(v) => setForm({ ...form, is_job_with_people: v })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-200">בחר קטגוריה</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm({ ...form, categoryIds: [cat.id] })}
                    className={`category-button flex items-center justify-between p-2 rounded-md border ${form.categoryIds.includes(cat.id) ? 'bg-cyan-600/30 border-cyan-500' : 'bg-slate-700/50 border-slate-600'}`}
                  >
                    <span>{cat.name}</span> <span>{cat.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="w-full bg-cyan-600 hover:bg-cyan-500 py-2.5 rounded-lg font-medium transition-all">
              {editingJob ? "עדכן משרה" : "פרסם עכשיו"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}