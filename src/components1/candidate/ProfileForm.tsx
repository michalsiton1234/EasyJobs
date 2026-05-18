// @ts-nocheck
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LEVELS } from "@/hooks/useCandidateProfile";
import "@/style/candidate/CandidateProfile.css";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface ProfileFormProps {
  form: {
    city: string;
    max_distance: number;
    min_hourly_rate: number;
    activity: boolean;
    level: string;
    IsRemoteOnly: boolean;
    WithPeople: boolean;
    categoryIds: number[];
  };
  setForm: (form: any) => void;
  categories: Category[];
  saving: boolean;
  onSave: () => void;
}

export default function ProfileForm({
  form,
  setForm,
  categories,
  saving,
  onSave,
}: ProfileFormProps) {
  return (
    <div className="profile-card">

      {/* עיר + מרחק */}
      <div className="profile-grid">
        <div>
          <Label className="profile-label">עיר</Label>
          <Input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <Label className="profile-label">מרחק חיפוש (ק"מ)</Label>
          <Input
            type="number"
            value={form.max_distance}
            onChange={(e) => setForm({ ...form, max_distance: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>

      {/* שכר שעתי */}
      <div className="profile-field">
        <Label className="profile-label">שכר שעתי מינימלי (₪)</Label>
        <Input
          type="number"
          value={form.min_hourly_rate}
          onChange={(e) => setForm({ ...form, min_hourly_rate: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
        />
      </div>

      {/* רמת קושי */}
      <div className="profile-field">
        <Label className="profile-label">רמת קושי מועדפת</Label>
        <div className="level-grid">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.value}
              type="button"
              onClick={() => setForm({ ...form, level: lvl.value })}
              className={`level-btn ${form.level === lvl.value ? "active" : "inactive"}`}
            >
              <span className="level-emoji">{lvl.emoji}</span>
              <span className="level-label">{lvl.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* קטגוריות */}
      <div className="profile-field">
        <Label className="profile-label">תחומי עניין</Label>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                const currentIds = form.categoryIds || [];
                const newIds = currentIds.includes(cat.id)
                  ? currentIds.filter((id) => id !== cat.id)
                  : [...currentIds, cat.id];
                setForm({ ...form, categoryIds: newIds });
              }}
              className={`category-btn ${
                form.categoryIds.includes(cat.id) ? "active" : "inactive"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Switches */}
      <div className="switches-section">
        <div className="switch-row">
          <Label>פעיל - מחפש עבודה</Label>
          <Switch
            checked={form.activity}
            onCheckedChange={(v) => setForm({ ...form, activity: v })}
          />
        </div>
        <div className="switch-row">
          <Label>עבודה מרחוק בלבד</Label>
          <Switch
            checked={form.IsRemoteOnly}
            onCheckedChange={(v) => setForm({ ...form, IsRemoteOnly: v })}
          />
        </div>
      </div>

      {/* כפתור שמירה */}
      <button onClick={onSave} disabled={saving} className="save-btn">
        {saving ? "שומר..." : "שמור פרופיל"}
      </button>
    </div>
  );
}
