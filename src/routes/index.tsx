import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  normalizeSearchParams,
  mapSearchParamsToQuery,
} from "@/jb/lib/jobs/query-mapper";
import { getJobsAction } from "@/jb/lib/jobs.functions";
import { JobList } from "@/jb/components/jobs/JobList";
import { JobFilters } from "@/jb/components/jobs/JobFilters";
import { ActiveFilterChips } from "@/jb/components/jobs/ActiveFilterChips";
import { Typography } from "@/jb/components/ui/Typography";
import { RetryButton } from "@/jb/components/jobs/RetryButton";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const normalized = normalizeSearchParams(deps.search);
    const query = mapSearchParamsToQuery(normalized);
    try {
      const initialData = await getJobsAction(query);
      return { initialData, query, error: null as string | null };
    } catch (err) {
      console.error(err);
      return {
        initialData: null,
        query,
        error:
          "We encountered an issue while loading the jobs. Please try again in a moment.",
      };
    }
  },
  component: HomePage,
});

function HomePage() {
  const { initialData, query, error } = Route.useLoaderData();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="space-y-4 max-w-3xl mb-16">
        <Typography
          variant="h1"
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Find your next <span className="text-primary">dream job.</span>
        </Typography>
        <Typography
          variant="lead"
          className="text-xl text-muted-foreground max-w-2xl"
        >
          Discover curated opportunities for data professionals, engineers, and
          designers. Structured job data for the modern workforce.
        </Typography>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <JobFilters />

        <div className="flex-1 min-w-0">
          <ActiveFilterChips
            filtersApplied={initialData?.meta?.filters_applied || []}
          />

          {error ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-10 text-center space-y-6">
              <div className="space-y-2">
                <Typography variant="h4" className="text-destructive">
                  Something went wrong
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  {error}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  Tip: set CLEANJOBDATA_API_URL and CLEANJOBDATA_API_KEY env
                  vars to connect to the API.
                </Typography>
              </div>
              <div className="flex justify-center">
                <RetryButton />
              </div>
            </div>
          ) : initialData ? (
            <JobList initialData={initialData} query={query} />
          ) : (
            <div className="text-center py-20">
              <Typography variant="muted">Loading jobs...</Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
