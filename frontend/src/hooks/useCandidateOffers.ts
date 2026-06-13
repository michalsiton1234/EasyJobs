// @ts-nocheck
import { useState, useEffect } from "react";
import { api } from "@/api/apiClient";
import { matchApi } from "@/api/matchApi";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { Match } from "@/models/Match";
import { toast } from "sonner";

export const statusConfig = {
  pending: {
    label: "ממתין",
    bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: Clock,
  },
  accepted: {
    label: "התקבל!",
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle,
  },
  rejected: {
    label: "נדחה",
    bg: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: XCircle,
  },
};

export function useCandidateOffers() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await matchApi.getMyMatches();
      const allMatches = [
        ...(data.algorithmMatches || []),
        ...(data.appliedMatches || []),
      ];
      setMatches(allMatches);
    } catch (error) {
      toast.error("שגיאה בטעינת הצעות");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (matchId: string, status: string) => {
    try {
      await api.put(`/Match/${matchId}/status`, { status });
      toast.success(status === "accepted" ? "🎉 קיבלת את ההצעה!" : "ההצעה נדחתה");
      loadOffers();
    } catch (error) {
      toast.error("העדכון נכשל");
    }
  };

  return {
    matches,
    loading,
    handleRespond,
  };
}
