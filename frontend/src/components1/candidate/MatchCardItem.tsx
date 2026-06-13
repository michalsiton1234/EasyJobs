// @ts-nocheck
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { getStatusText } from "@/hooks/useAccepted";
import "@/style/candidate/Accepted.css";

interface MatchCardItemProps {
  match: any;
  variant: "algorithm" | "applied";
}

export default function MatchCardItem({ match, variant }: MatchCardItemProps) {
  const status = getStatusText(match.Status);

  return (
    <div className="match-card-item">
      <div className="match-card-inner">
        <div className="match-card-body">
          <h3 className="match-card-title">{match.Job.Title}</h3>
          <div className="match-card-meta">
            {match.Job.Payment && <span>₪{match.Job.Payment}/שעה</span>}
            {match.Job.Location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {match.Job.Location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="match-card-level">{match.Job.LevelLabel}</span>
              <span className="match-card-score">ציון: {Math.round(match.MatchScore)}%</span>
            </span>
          </div>
          <p className="match-card-description">{match.Job.Description}</p>
        </div>

        <div className="match-card-side">
          <div className={`match-card-status ${status.bgColor}`}>
            {status.text}
          </div>
          <div className="match-card-date">
            <div className="match-card-date-row">
              <Clock className="w-3 h-3" />
              {new Date(match.MatchDate).toLocaleDateString("he-IL")}
            </div>
            <div className="match-card-algo-row">
              {variant === "algorithm" ? (
                <>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="match-card-algo-label">נבחר על ידי האלגוריתם</span>
                </>
              ) : (
                <span className="match-card-algo-label">הוגשת על ידי</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
