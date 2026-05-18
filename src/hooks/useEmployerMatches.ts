import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/api/apiClient";
import { toast } from "sonner";
import { fetchMatches } from "@/store/matchSlice";
import { GetMatchsByEmpID, GetMatchByJobID, GetRejecteds } from "@/api/matchApi";
import type { RootState } from "@/store";
import type { JobListing } from "@/models/JobListing";
import type { Match } from "@/models/Match";

export function useEmployerMatches() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: allMatches } = useSelector((state: RootState) => state.matches);

  const [activeTab, setActiveTab] = useState<"smart" | "offers">("smart");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [offers, setOffers] = useState<Match[]>([]);
  const [isRunningAlg, setIsRunningAlg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [algorithmResults, setAlgorithmResults] = useState<Match[]>([]);
  const [isViewSpecific, setIsViewSpecific] = useState(false);
  const [isFetchingSpecific, setIsFetchingSpecific] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const userId = parseInt(user.id);
      dispatch(fetchMatches(userId) as any);
      loadOffers(userId);
      fetchLatestAlgorithmResults(userId);
    }
  }, [user?.id, dispatch]);

  const fetchLatestAlgorithmResults = async (userId: number) => {
    try {
      setIsFetchingSpecific(true);
      const empRes = await api.get(`/Employer/byUser/${userId}`);
      const results = await GetRejecteds(empRes.data.id);
      if (results && results.length > 0) {
        setAlgorithmResults(results);
        setIsViewSpecific(true);
      }
    } catch (err) {
      console.error("Error fetching specific results:", err);
    } finally {
      setIsFetchingSpecific(false);
    }
  };

  const loadJobsForSelection = async () => {
    if (!user?.id) return;
    try {
      setIsLoadingJobs(true);
      const empRes = await api.get(`/Employer/byUser/${user.id}`);
      const employerId = empRes.data.id;
      const res = await api.get(`/JobListing/getByEmp/${employerId}`);
      setJobs(res.data);
    } catch (err) {
      toast.error("נכשל בטעינת רשימת המשרות");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const loadOffers = async (userId: number) => {
    try {
      const empRes = await api.get(`/Employer/byUser/${userId}`);
      console.log("empRes.data:", empRes.data); // ← הוסיפי
      const data = await GetMatchsByEmpID(empRes.data.id);
      console.log("offers data:", data); // ← הוסיפי את זה
      setOffers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAlgorithm = async () => {
    if (!user?.id || !selectedJobId) {
      toast.error("אנא בחר משרה");
      return;
    }
    try {
      setIsRunningAlg(true);
      await GetMatchByJobID(selectedJobId);
      const userId = parseInt(user.id);
      await fetchLatestAlgorithmResults(userId);
      toast.success("התאמות חכמות עודכנו בהצלחה!");
      dispatch(fetchMatches(userId) as any);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("שגיאה בהפעלת האלגוריתם");
    } finally {
      setIsRunningAlg(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    loadJobsForSelection();
  };

  const displayList = isViewSpecific ? algorithmResults : allMatches;

  return {
    user,
    activeTab,
    setActiveTab,
    jobs,
    offers,
    isRunningAlg,
    isModalOpen,
    setIsModalOpen,
    selectedJobId,
    setSelectedJobId,
    isLoadingJobs,
    isFetchingSpecific,
    algorithmResults,
    isViewSpecific,
    setIsViewSpecific,
    displayList,
    handleRunAlgorithm,
    handleOpenModal,
  };
}
