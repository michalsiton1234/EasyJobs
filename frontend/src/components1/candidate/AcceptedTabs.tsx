// @ts-nocheck
import { motion } from "framer-motion";
import { Zap, Users } from "lucide-react";
import MatchCardItem from "@/components1/candidate/MatchCardItem";
import type { TabType } from "@/hooks/useAccepted";
import "@/style/candidate/Accepted.css";

interface AcceptedTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  algorithmMatches: any[];
  appliedMatches: any[];
}

export default function AcceptedTabs({
  activeTab,
  setActiveTab,
  algorithmMatches,
  appliedMatches,
}: AcceptedTabsProps) {
  return (
    <>
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="accepted-tabs"
      >
        <button
          onClick={() => setActiveTab("algorithm")}
          className={`accepted-tab ${activeTab === "algorithm" ? "active" : "inactive"}`}
        >
          <Zap className="w-4 h-4" />
          <span>הצעות מהמערכת</span>
        </button>

        <button
          onClick={() => setActiveTab("applied")}
          className={`accepted-tab ${activeTab === "applied" ? "active" : "inactive"}`}
        >
          <Users className="w-4 h-4" />
          <span>הגשות שלי</span>
        </button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === "algorithm" && (
          <div className="accepted-list">
            <h2 className="accepted-section-title">הצעות מהמערכת</h2>
            {algorithmMatches.length === 0 ? (
              <div className="accepted-empty">
                <div className="accepted-empty-icon">
                  <Zap className="w-8 h-8 text-gray-300" />
                </div>
                <h3>אין התאמה אוטומטיות</h3>
                <p>האלגוריתם ירוץ כל יום ויצור התאמות אוטומטיות עבורך.</p>
              </div>
            ) : (
              algorithmMatches.map((match) => (
                <MatchCardItem key={match.MatchId} match={match} variant="algorithm" />
              ))
            )}
          </div>
        )}

        {activeTab === "applied" && (
          <div className="accepted-list">
            <h2 className="accepted-section-title">הגשות שלי</h2>
            {appliedMatches.length === 0 ? (
              <div className="accepted-empty">
                <div className="accepted-empty-icon">
                  <Users className="w-8 h-8 text-gray-300" />
                </div>
                <h3>לא הגשת לאף משרה</h3>
                <p>עדיין להגיש למשרות המתאימות לך בלחיצה על "הגש מועמדות".</p>
              </div>
            ) : (
              appliedMatches.map((match) => (
                <MatchCardItem key={match.MatchId} match={match} variant="applied" />
              ))
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
