// // @ts-nocheck
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "@/api/apiClient";
// import { toast } from "sonner";
// import { useAuth } from "@/lib/AuthContext";

// export const LEVELS = [
//   { value: "easy", label: "קלה", emoji: "😊" },
//   { value: "medium", label: "בינונית", emoji: "💪" },
//   { value: "hard", label: "קשה", emoji: "🔥" },
// ];

// export function useCandidateProfile() {
//   const navigate = useNavigate();
//   const { isLoading: authLoading } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [profileId, setProfileId] = useState<number | null>(null);
//   const [categories, setCategories] = useState<{ id: number; name: string; icon: string }[]>([]);

//   const [form, setForm] = useState({
//     city: "",
//     max_distance: 10,
//     min_hourly_rate: 30,
//     activity: true,
//     level: "easy",
//     IsRemoteOnly: false,
//     WithPeople: true,
//     categoryIds: [] as number[],
//   });

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   // מחכה ש-auth יסתיים לפני שקוראים ל-API
//   useEffect(() => {
//     if (!authLoading) {
//       loadData();
//     }
//   }, [authLoading]);

//   const loadCategories = async () => {
//     try {
//       const res = await api.get("/Category");
//       const categoryIcons: { [key: string]: string } = {
//         "ביביסיטר": "👶", "משלוחים": "📦", "ניקיון": "🧹",
//         "קלדנות": "⌨️", "סטודנט": "📚", "מרחוק": "🏠",
//         "אחר": "✨", "שירות": "🎧",
//       };
//       const mappedCategories = res.data.map((cat: any) => ({
//         id: cat.id,
//         name: cat.name,
//         icon: categoryIcons[cat.name] || "📋",
//       }));
//       setCategories(mappedCategories);
//     } catch (err) {
//       console.error("שגיאה בטעינת קטגוריות:", err);
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("אינך מחובר. אנא התחבר למערכת.");
//         return;
//       }

//       let response;
//       try {
//         response = await api.get("/Candidate/my-profile");
//       } catch (e1) {
//         try {
//           response = await api.get("/candidate/my-profile");
//         } catch (e2) {
//           response = null;
//         }
//       }

//       if (response && response.data) {
//         const p = response.data;
//         debugger;
//         const loadedCategoryIds =
//           p.categoryIds || p.categoryId || p.CategoryId || p.CategoryIds || [];

//         const levelMap = { 0: "easy", 1: "medium", 2: "hard" };
//         const currentLevel = levelMap[p.level] || levelMap[p.Level] || "easy";

//         setForm({
//           city: p.City || p.city || "",
//           max_distance: p.max_distance || p.MaxDistance || 10,
//           min_hourly_rate: p.minHourlyRate || 30,
//           activity: p.activity !== false,
//           level: currentLevel,
//           IsRemoteOnly: !!(p.IsRemoteOnly || p.isRemoteOnly),
//           WithPeople: p.WithPeople !== false,
//           categoryIds: Array.isArray(loadedCategoryIds)
//             ? loadedCategoryIds
//             : [loadedCategoryIds],
//         });
//         setProfileId(p.id);
//       }
//     } catch (error) {
//       console.error("שגיאה בטעינת פרופיל:", error);
//       setError("אירעה שגיאה בטעינת הפרופיל.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setError("");

//     const levelValue = form.level === "easy" ? 0 : form.level === "medium" ? 1 : 2;

//     const data = {
//       Id: profileId,
//       City: form.city,
//       MaxDistance: Number(form.max_distance),
//       MinHourlyRate: Number(form.min_hourly_rate),
//       Activity: Boolean(form.activity),
//       Level: levelValue,
//       IsRemoteOnly: Boolean(form.IsRemoteOnly),
//       WithPeople: Boolean(form.WithPeople),
//       CategoryId: form.categoryIds[0] || 1,
//     };

//     try {
//       if (profileId) {
//         await api.put(`/Candidate/${profileId}`, data);
//       } else {
//         await api.post("/Candidate/profile", data);
//       }

//       toast.success("הפרופיל עודכן בהצלחה!");
//       setTimeout(() => navigate("/candidate/my-area"), 500);
//     } catch (e: any) {
//       console.error("שגיאה בעדכון הפרופיל:", e);
//       setError("נכשלה שמירת הנתונים. נסה שוב מאוחר יותר.");
//       toast.error("שגיאה בשמירה");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return {
//     loading,
//     saving,
//     error,
//     form,
//     setForm,
//     categories,
//     handleSave,
//   };
// }
// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/apiClient";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext"; // <-- חיבור חיוני ל-Context שלכם

export const LEVELS = [
  { value: "easy", label: "קלה", emoji: "😊" },
  { value: "medium", label: "בינונית", emoji: "💪" },
  { value: "hard", label: "קשה", emoji: "🔥" },
];

export function useCandidateProfile() {
  const navigate = useNavigate();

  // שליפת הסטייט הגלובלי כדי לדעת מתי בדיקת ה-Token באמת הסתיימה
  const { user, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileId, setProfileId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string; icon: string }[]>([]);

  const [form, setForm] = useState({
    city: "",
    max_distance: 10,
    min_hourly_rate: 30,
    activity: true,
    level: "easy",
    IsRemoteOnly: false,
    WithPeople: true,
    categoryIds: [] as number[],
  });

  // טעינת קטגוריות כלליות - יכולה לרוץ מייד
  useEffect(() => {
    loadCategories();
  }, []);

  // ניהול שליפת הנתונים רק לאחר שהמשתמש מאומת ב-Context
  useEffect(() => {
    if (authLoading) return; // עצור! אל תפנה לשרת כל עוד ה-Context בודק את הטוקן

    if (!user) {
      setError("אינך מחובר. אנא התחבר למערכת.");
      setLoading(false);
      return;
    }

    // רק כשהאימות הסתיים בהצלחה והמשתמש קיים - נמשוך את הפרופיל
    loadData();
  }, [user, authLoading]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/Category");
      const categoryIcons: { [key: string]: string } = {
        "ביביסיטר": "👶", "משלוחים": "📦", "ניקיון": "🧹",
        "קלדנות": "⌨️", "סטודנט": "📚", "מרחוק": "🏠",
        "אחר": "✨", "שירות": "🎧",
      };
      const mappedCategories = res.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: categoryIcons[cat.name] || "📋",
      }));
      setCategories(mappedCategories);
    } catch (err) {
      console.error("שגיאה בטעינת קטגוריות:", err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      try {
        response = await api.get("/Candidate/my-profile");
      } catch (e1) {
        try {
          response = await api.get("/candidate/my-profile");
        } catch (e2) {
          response = null;
        }
      }

      if (response && response.data) {
        const p = response.data;
        const loadedCategoryIds =
          p.categoryIds || p.categoryId || p.CategoryId || p.CategoryIds || [];

        const levelMap = { 0: "easy", 1: "medium", 2: "hard" };
        const currentLevel = levelMap[p.level] || levelMap[p.Level] || "easy";

        setForm({
          city: p.City || p.city || "",
          max_distance: p.max_distance || p.MaxDistance || 10,
          min_hourly_rate: p.minHourlyRate || 30,
          activity: p.activity !== false,
          level: currentLevel,
          IsRemoteOnly: !!(p.IsRemoteOnly || p.isRemoteOnly),
          WithPeople: p.WithPeople !== false,
          categoryIds: Array.isArray(loadedCategoryIds)
            ? loadedCategoryIds
            : [loadedCategoryIds],
        });
        setProfileId(p.id);
      }
    } catch (error) {
      console.error("שגיאה בטעינת פרופיל:", error);
      setError("אירעה שגיאה בטעינת הפרופיל.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const levelValue = form.level === "easy" ? 0 : form.level === "medium" ? 1 : 2;

    const data = {
      Id: profileId,
      City: form.city,
      MaxDistance: Number(form.max_distance),
      MinHourlyRate: Number(form.min_hourly_rate),
      Activity: Boolean(form.activity),
      Level: levelValue,
      IsRemoteOnly: Boolean(form.IsRemoteOnly),
      WithPeople: Boolean(form.WithPeople),
      CategoryId: form.categoryIds[0] || 1,
    };

    try {
      if (profileId) {
        await api.put(`/Candidate/${profileId}`, data);
      } else {
        await api.post("/Candidate/profile", data);
      }

      toast.success("הפרופיל עודכן בהצלחה!");
      setTimeout(() => navigate("/candidate/my-area"), 500);
    } catch (e: any) {
      console.error("שגיאה בעדכון הפרופיל:", e);
      setError("נכשלה שמירת הנתונים. נסה שוב מאוחר יותר.");
      toast.error("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  return {
    loading: authLoading || loading, // משלב את טעינת ה-Auth עם טעינת הנתונים למניעת פליקרים ושגיאות
    saving,
    error,
    form,
    setForm,
    categories,
    handleSave,
  };
}