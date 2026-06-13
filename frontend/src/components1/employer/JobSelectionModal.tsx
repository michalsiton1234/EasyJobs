import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import type { JobListing } from "@/models/JobListing";

interface JobSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobListing[];
  isLoadingJobs: boolean;
  selectedJobId: number | null;
  onSelectJob: (id: number) => void;
  onRunAlgorithm: () => void;
  isRunningAlg: boolean;
}

export default function JobSelectionModal({
  isOpen,
  onClose,
  jobs,
  isLoadingJobs,
  selectedJobId,
  onSelectJob,
  onRunAlgorithm,
  isRunningAlg,
}: JobSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="job-selection-modal"
          >
            <div className="modal-header">
              <h3>בחר משרה לעדכון</h3>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <div className="job-list-container">
              {isLoadingJobs ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className={`job-option ${selectedJobId === job.id ? "selected" : ""}`}
                  >
                    {job.title} (ID: {job.id})
                  </div>
                ))
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={onRunAlgorithm}
                disabled={isRunningAlg || !selectedJobId}
                className="run-alg-btn"
              >
                {isRunningAlg ? "מעבד..." : "הפעל אלגוריתם"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
