import * as React from "react";
import { Sheet } from "@/jb/components/ui/Sheet";
import { JobDetailView } from "./JobDetailView";
import { getJobByIdAction } from "@/jb/lib/jobs.functions";
import type { JobDetail } from "@/jb/lib/api/types";
import { FaSpinner } from "react-icons/fa6";
import { Typography } from "@/jb/components/ui/Typography";

interface Ctx {
  openJob: (id: string) => void;
}

const JobSideViewContext = React.createContext<Ctx | null>(null);

export function useJobSideView() {
  return React.useContext(JobSideViewContext);
}

export function JobSideViewProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [job, setJob] = React.useState<JobDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const openJob = React.useCallback((id: string) => {
    setOpenId(id);
  }, []);

  const close = React.useCallback(() => {
    setOpenId(null);
    setTimeout(() => {
      setJob(null);
      setError(null);
    }, 500);
  }, []);

  React.useEffect(() => {
    if (!openId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setJob(null);
    getJobByIdAction(openId)
      .then((res) => {
        if (cancelled) return;
        if ("__notFound" in res) {
          setError("Job not found.");
        } else {
          setJob(res);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load job details.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [openId]);

  return (
    <JobSideViewContext.Provider value={{ openJob }}>
      {children}
      <Sheet isOpen={openId !== null} onClose={close}>
        {loading || (!job && !error) ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
            <FaSpinner className="h-8 w-8 animate-spin text-primary" />
            <Typography variant="muted" className="animate-pulse font-medium">
              Loading job details...
            </Typography>
          </div>
        ) : error ? (
          <div className="py-40 text-center">
            <Typography variant="h4" className="text-destructive">
              {error}
            </Typography>
          </div>
        ) : job ? (
          <JobDetailView job={job} />
        ) : null}
      </Sheet>
    </JobSideViewContext.Provider>
  );
}
