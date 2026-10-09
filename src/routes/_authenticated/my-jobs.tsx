import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listMyPostedJobs,
  deletePostedJob,
  setPostedJobStatus,
} from "@/jb/lib/posted-jobs.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, Trash2, Eye, EyeOff, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my-jobs")({
  head: () => ({
    meta: [
      { title: "My Jobs | JobBoard" },
      { name: "description", content: "Manage your posted job listings." },
      { property: "og:title", content: "My Jobs | JobBoard" },
      { property: "og:description", content: "Manage your posted job listings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyJobsPage,
});

const myJobsQuery = {
  queryKey: ["my-posted-jobs"],
  queryFn: () => listMyPostedJobs(),
};

function MyJobsPage() {
  const queryClient = useQueryClient();
  const { data: jobs, isLoading } = useQuery(myJobsQuery);
  const deleteJob = useServerFn(deletePostedJob);
  const setStatus = useServerFn(setPostedJobStatus);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: myJobsQuery.queryKey });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this job listing? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await deleteJob({ data: { id } });
      toast.success("Job deleted");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggle(id: string, current: string) {
    setBusyId(id);
    try {
      const next = current === "published" ? "draft" : "published";
      await setStatus({ data: { id, status: next } });
      toast.success(next === "published" ? "Job published" : "Job unpublished");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the listings you've posted.
          </p>
        </div>
        <Button asChild>
          <Link to="/post-job">
            <Plus className="mr-1.5 h-4 w-4" /> Post a Job
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-muted/40" />
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
            <Button asChild className="mt-4">
              <Link to="/post-job">Post your first job</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-semibold">{job.title}</h2>
                    <Badge variant={job.status === "published" ? "default" : "secondary"}>
                      {job.status === "published" ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                    <span>{job.company_name}</span>
                    {job.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                      </span>
                    )}
                    <span className="capitalize">{job.remote_type}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === job.id}
                    onClick={() => handleToggle(job.id, job.status)}
                  >
                    {job.status === "published" ? (
                      <>
                        <EyeOff className="mr-1.5 h-4 w-4" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1.5 h-4 w-4" /> Publish
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={busyId === job.id}
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
