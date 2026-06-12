import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FaChevronLeft } from "react-icons/fa6";
import { getJobByIdAction } from "@/jb/lib/jobs.functions";
import { JobDetailView } from "@/jb/components/jobs/JobDetailView";
import { Button } from "@/jb/components/ui/Button";

export const Route = createFileRoute("/jobs/$id")({
  loader: async ({ params }) => {
    try {
      const result = await getJobByIdAction(params.id);
      if ("__notFound" in result) throw notFound();
      return { job: result, error: null as string | null };
    } catch (err) {
      if (err && typeof err === "object" && "isNotFound" in (err as object)) {
        throw err;
      }
      console.error(err);
      return {
        job: null,
        error:
          "We couldn't load this job. The API may not be configured (set CLEANJOBDATA_API_URL and CLEANJOBDATA_API_KEY).",
      };
    }
  },
  head: ({ params, loaderData }) => {
    const job = loaderData?.job;
    if (!job) return { meta: [{ title: "Job — CleanJobData" }] };
    const company = job.company?.name || "a company";
    const title = `${job.title} at ${company}`;
    const rawDesc =
      job.company?.description ||
      `Apply for ${job.title} at ${company}. View role details, requirements, and compensation on CleanJobData's live job board demo powered by the CleanJobData jobs API.`;
    const description =
      rawDesc.length < 50
        ? `${rawDesc} Apply now via CleanJobData's job board demo powered by the jobs posting API.`
        : rawDesc.length > 160
          ? rawDesc.slice(0, 157) + "..."
          : rawDesc;
    const url = `https://cleanjobdata-job-board.lovable.app/jobs/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.description || description,
            datePosted: job.published,
            hiringOrganization: {
              "@type": "Organization",
              name: company,
              sameAs: job.company?.website_url || undefined,
              logo: job.company?.logo || undefined,
            },
            jobLocation: job.location
              ? { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } }
              : undefined,
            employmentType: job.employment_type || undefined,
            url,
          }),
        },
      ],
    };
  },
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
  const { job, error } = Route.useLoaderData();
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
      {job ? (
        <JobDetailView job={job} />
      ) : (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-10 text-center">
          <h1 className="text-xl font-semibold text-destructive mb-2">
            Unable to load job
          </h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}
    </div>
  );
}
