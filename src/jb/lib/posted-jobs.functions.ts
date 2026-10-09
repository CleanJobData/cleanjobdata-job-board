import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const postedJobInput = z.object({
  title: z.string().min(3).max(200),
  company_name: z.string().min(2).max(200),
  company_website: z.string().url().optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  remote_type: z.enum(["onsite", "remote", "hybrid"]),
  employment_type: z.enum(["full_time", "part_time", "contract", "internship", "temporary"]),
  experience_level: z.enum(["entry", "mid", "senior", "lead", "executive"]).optional().or(z.literal("")),
  salary_min: z.number().int().positive().optional().nullable(),
  salary_max: z.number().int().positive().optional().nullable(),
  salary_currency: z.string().length(3).default("USD"),
  description: z.string().min(20).max(20000),
  apply_url: z.string().url().optional().or(z.literal("")),
  apply_email: z.string().email().optional().or(z.literal("")),
});

export const createPostedJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => postedJobInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: job, error } = await supabase
      .from("posted_jobs")
      .insert({
        ...data,
        experience_level: data.experience_level || null,
        company_website: data.company_website || null,
        location: data.location || null,
        apply_url: data.apply_url || null,
        apply_email: data.apply_email || null,
        user_id: userId,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: job.id };
  });

export const listMyPostedJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("posted_jobs")
      .select("id, title, company_name, location, remote_type, employment_type, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deletePostedJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("posted_jobs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setPostedJobStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["published", "draft"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("posted_jobs")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
