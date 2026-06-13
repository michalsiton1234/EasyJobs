import { motion } from "framer-motion";
import { Briefcase, Send, MapPin, Banknote, Zap, AlignRight } from "lucide-react";
import "@/style/candidate/MyArea.css";

interface JobMatchCardProps {
  job: any;
  index: number;
  onApply: (jobId: number, jobTitle: string) => void;
}

export default function JobMatchCard({ job, index, onApply }: JobMatchCardProps) {
  const title = job.Title || job.title || "משרה ללא שם";
  const score = job.MatchScore || job.matchScore || 0;
  const id = job.JobId || job.jobId || job.id;
  const location = job.Location || job.location || "לא צוין";
  const salary = job.Salary || job.salary || job.Payment || job.payment || "לא צוין";
  const description = job.Description || job.description || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-4 items-start flex-1">
            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-xl">{title}</h3>
                <span className="job-card-id">ID: {id}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <Banknote className="w-4 h-4 text-cyan-500" />
                  <span>₪{salary} / שעה</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <Zap className="w-3 h-3 fill-emerald-600" />
                  <span>{Math.round(score)}% התאמה</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onApply(id, title)}
            className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-100 active:scale-95"
          >
            <Send className="w-4 h-4 text-white" />
            הגש מועמדות
          </button>
        </div>

        {description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold text-sm">
              <AlignRight className="w-4 h-4 text-cyan-500" />
              <h4>תיאור המשרה:</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
