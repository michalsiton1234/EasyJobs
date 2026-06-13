import { useNavigate } from "react-router-dom";
import { Mail, Send, ExternalLink } from "lucide-react";
import type { Match } from "@/models/Match";

interface MatchCardProps {
  match: Match;
  variant: "smart" | "offer";
}

export default function MatchCard({ match, variant }: MatchCardProps) {
  const navigate = useNavigate();

  if (variant === "smart") {
    return (
      <div key={match.id} className="match-card p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Mail className="text-cyan-400" size={20} />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm truncate" title={match.candidateEmail}>
                {match.candidateEmail || `מועמד #${match.candidateId}`}
              </h3>
              <p className="text-xs text-white/40">משרה: #{match.jobId}</p>
            </div>
          </div>
          <div className="score-badge shrink-0">{match.matchScore}% התאמה</div>
        </div>
      </div>
    );
  }

  return (
    <div key={match.id} className="match-card p-6 border-emerald-500/20">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Send className="text-emerald-400" size={18} />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-sm truncate">
              {match.candidateEmail || `מועמד #${match.candidateId}`}
            </h3>
            <p className="text-xs text-white/40 italic">משרה #{match.jobId}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/employer/candidate/${match.candidateId}`)}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs rounded-lg transition-colors border border-emerald-500/20"
      >
        <ExternalLink size={14} />
        צפה בפרופיל המועמד
      </button>
    </div>
  );
}
