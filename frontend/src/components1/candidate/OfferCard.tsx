// @ts-nocheck
import { motion } from "framer-motion";
import { MapPin, CheckCircle, XCircle } from "lucide-react";
import { statusConfig } from "@/hooks/useCandidateOffers";
import "@/style/candidate/CandidateOffers.css";

interface OfferCardProps {
  match: any;
  onRespond: (matchId: string, status: string) => void;
}

export default function OfferCard({ match, onRespond }: OfferCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "offer-status-badge offer-status-pending";
      case "accepted": return "offer-status-badge offer-status-accepted";
      case "rejected": return "offer-status-badge offer-status-rejected";
      default: return "offer-status-badge offer-status-default";
    }
  };

  return (
    <motion.div
      key={match.MatchId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="offer-card"
    >
      <div className="offer-card-body">
        <h3 className="offer-card-title">{match.Job?.Title || "משרה"}</h3>
        <div className="offer-card-meta">
          <span className="offer-card-location">
            <MapPin className="w-3 h-3" />
            {match.Job?.Location}
          </span>
          {match.Job?.Payment && (
            <span className="offer-card-payment">₪{match.Job.Payment}/שעה</span>
          )}
        </div>
        <div className="offer-card-badges">
          <span className={getStatusClass(match.Status)}>
            {statusConfig[match.Status as keyof typeof statusConfig]?.label || match.Status}
          </span>
          <span className="offer-card-score">
            ציון: {Math.round(match.MatchScore)}% |{" "}
            {new Date(match.MatchDate).toLocaleDateString("he-IL")}
          </span>
        </div>
      </div>

      {match.Status === "pending" && (
        <div className="offer-actions">
          <button
            onClick={() => onRespond(match.MatchId.toString(), "accepted")}
            className="offer-btn-accept"
          >
            <CheckCircle size={24} />
          </button>
          <button
            onClick={() => onRespond(match.MatchId.toString(), "rejected")}
            className="offer-btn-reject"
          >
            <XCircle size={24} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
