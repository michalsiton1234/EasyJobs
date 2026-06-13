// @ts-nocheck
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { getMyMatches } from "@/api/matchApi";
import type { RootState } from "@/store";

export type TabType = "algorithm" | "applied";

export function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return { text: "ממתין לאישור", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    case "accepted":
      return { text: "התקבלת! 🎉", color: "text-green-600", bgColor: "bg-green-100" };
    case "rejected":
      return { text: "נדחה", color: "text-red-600", bgColor: "bg-red-100" };
    default:
      return { text: status, color: "text-gray-600", bgColor: "bg-gray-100" };
  }
}

export function useAccepted() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [algorithmMatches, setAlgorithmMatches] = useState<any[]>([]);
  const [appliedMatches, setAppliedMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("algorithm");

  const loadMyMatches = async () => {
    try {
      setLoading(true);
      console.log("🚀 Accepted - Loading my matches...");
      const data = await getMyMatches();
      console.log("📋 Accepted - My matches loaded:", data);
      setAlgorithmMatches(data.algorithmMatches || []);
      setAppliedMatches(data.appliedMatches || []);
    } catch (error) {
      console.error("❌ Accepted - Error loading matches:", error);
      toast.error("שגיאה בטעינת התאמות");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyMatches();
  }, []);

  return {
    user,
    loading,
    algorithmMatches,
    appliedMatches,
    activeTab,
    setActiveTab,
  };
}
