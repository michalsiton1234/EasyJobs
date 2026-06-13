import { jobAPI } from "@/api/jobsApi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { useState, useEffect } from "react";
import { applyToJobThunk } from "@/store/matchSlice";
import { toast } from "sonner";
import { candidateAPI } from "@/api/candidateApi";

export function useMyArea() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const fetchJobs = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const can = await candidateAPI.getByUserId(user.id);
      debugger;
      const data = await jobAPI.GetTopMatchesForCandidate(can.id || 0);
      debugger;
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("שגיאה בטעינת הנתונים מהשרת");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchJobs();
  }, [user?.id]);

  const handleApplyClick = async (jobId: number, jobTitle: string) => {
    try {
      await dispatch(applyToJobThunk(jobId)).unwrap();
      toast.success(`הגשת מועמדות ל"${jobTitle}" נשלחה בהצלחה!`);
      fetchJobs();
    } catch (error) {
      console.error("Apply error:", error);
      toast.error(typeof error === "string" ? error : "אירעה שגיאה בהגשת המועמדות");
    }
  };

  return {
    suggestions,
    loading,
    fetchJobs,
    handleApplyClick,
  };
}
