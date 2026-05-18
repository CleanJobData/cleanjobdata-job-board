import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FaChevronLeft } from "react-icons/fa6";
import { getJobByIdAction } from "@/jb/server/jobs.functions";
import { JobDetailView } from "@/jb/components/jobs/JobDetailView";
import { Button } from "@/jb/components/ui/Button";

export const Route = createFileRoute("/jobs/$id")({
  loader: async ({ params }) => {
    const result = await getJobByIdAction(params.id);
    if ("__notFound" in result) throw notFound();
    return { job: result };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.job.title} at ${loaderData.job.company?.name || "Unknown"}`,
          },
          {
            name: "description",
            content:
              loaderData.job.company?.description ||
              `Apply for ${loaderData.job.title}.`,
          },
        ]
      : [{ title: "Job" }],
  }),
  component: JobPage,
  notFoundComponent: () => (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Job not found</h1>
      <Button asChild>
        <Link to="/">Back to jobs</Link>
      </Button>
    </div>
  ),
});

function JobPage() {
  const { job } = Route.useLoaderData();
  return (
    <div className="container mx-auto py-12 px-4 md:px-10">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-2 text-muted-foreground"
        >
          <Link to="/">
            <FaChevronLeft className="mr-1 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>
      <JobDetailView job={job} />
    </div>
  );
}
