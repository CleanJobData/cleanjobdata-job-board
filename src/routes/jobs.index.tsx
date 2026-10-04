import { createFileRoute } from "@tanstack/react-router";
import { normalizeSearchParams, mapSearchParamsToQuery } from "@/jb/lib/jobs/query-mapper";
import { getJobsAction } from "@/jb/lib/jobs.functions";
import { JobList } from "@/jb/components/jobs/JobList";
import { JobFilters } from "@/jb/components/jobs/JobFilters";
import { ActiveFilterChips } from "@/jb/components/jobs/ActiveFilterChips";
import { RetryButton } from "@/jb/components/jobs/RetryButton";
import { JobSideViewProvider } from "@/jb/components/jobs/JobSideViewProvider";

export const Route = createFileRoute("/jobs/")({
  validateSearch: (search: Record<string, unknown>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const query = mapSearchParamsToQuery(normalizeSearchParams(deps.search));
    try {
      return { initialData: await getJobsAction(query), query, error: null as string | null };
    } catch (err) {
      console.error(err);
      return { initialData: null, query, error: "We couldn't load jobs right now. Please try again shortly." };
    }
  },
  head: () => ({ meta: [
    { title: "Browse Live Job Listings | CleanJobData API Demo" },
    { name: "description", content: "Explore structured, searchable job listings powered by the CleanJobData jobs posting API. See how your own job board could work." },
    { property: "og:title", content: "Browse Live Job Listings | CleanJobData API Demo" },
    { property: "og:description", content: "A live demonstration of structured job postings from the CleanJobData API." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: JobsPage,
});

function JobsPage() {
  const { initialData, query, error } = Route.useLoaderData();
  return (
    <JobSideViewProvider>
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Browse Jobs</h1>
          <p className="mt-1 text-muted-foreground">Filter by location, salary, experience level, and more.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <JobFilters />
          <div className="flex-1 min-w-0">
            <ActiveFilterChips filtersApplied={initialData?.meta?.filters_applied || []} />
            {error ? (
              <div className="border border-destructive/20 bg-destructive/10 p-8 text-center space-y-4">
                <h2 className="font-semibold text-destructive">Something went wrong</h2>
                <p className="text-muted-foreground">{error}</p>
                <RetryButton />
              </div>
            ) : initialData ? <JobList initialData={initialData} query={query} /> : null}
          </div>
        </div>
      </div>
    </JobSideViewProvider>
  );
}