import { createServerFn } from "@tanstack/react-start";
import { listJobs, getJobById } from "@/jb/lib/api/jobs.server";
import { suggestGeo } from "@/jb/lib/api/geo.server";
import type { ListQuery } from "@/jb/lib/jobs/query-types";
import type {
  Job,
  JobDetail,
  ListResponse,
  GeoSuggestResult,
} from "@/jb/lib/api/types";
import { ApiError } from "@/jb/lib/api/client.server";

const listJobsFn = createServerFn({ method: "POST" })
  .inputValidator((input: ListQuery) => input ?? {})
  .handler(async ({ data }): Promise<ListResponse<Job>> => {
    try {
      return await listJobs(data);
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(`[Server Fn API Error] ${err.status} ${err.message} (${err.url})`);
      } else {
        console.error("[Server Fn Error]", err);
      }
      throw new Error("We couldn't load jobs. Please try again in a moment.");
    }
  });

const getJobByIdFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }): Promise<JobDetail | { __notFound: true }> => {
    try {
      return await getJobById(data.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return { __notFound: true };
      }
      console.error("[getJobById Server Fn Error]", err);
      throw new Error("Could not load job details.");
    }
  });

const suggestGeoFn = createServerFn({ method: "POST" })
  .inputValidator((input: { q: string }) => input)
  .handler(async ({ data }): Promise<GeoSuggestResult[]> => {
    try {
      return await suggestGeo(data.q);
    } catch (err) {
      console.error("[suggestGeo Server Fn Error]", err);
      return [];
    }
  });

// Compatibility wrappers preserving the original call signature
export async function getJobsAction(query: ListQuery): Promise<ListResponse<Job>> {
  return listJobsFn({ data: query });
}

export async function getJobByIdAction(
  id: string,
): Promise<JobDetail | { __notFound: true }> {
  return getJobByIdFn({ data: { id } });
}

export async function getGeoSuggestions(q: string): Promise<GeoSuggestResult[]> {
  if (!q || q.length < 2) return [];
  return suggestGeoFn({ data: { q } });
}
