import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createPostedJob } from "@/jb/lib/posted-jobs.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/post-job")({
  head: () => ({
    meta: [
      { title: "Post a Job | JobBoard" },
      { name: "description", content: "Publish a new job listing." },
      { property: "og:title", content: "Post a Job | JobBoard" },
      { property: "og:description", content: "Publish a new job listing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PostJobPage,
});

function PostJobPage() {
  const navigate = useNavigate();
  const createJob = useServerFn(createPostedJob);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company_name: "",
    company_website: "",
    location: "",
    remote_type: "onsite",
    employment_type: "full_time",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "USD",
    description: "",
    apply_url: "",
    apply_email: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.apply_url && !form.apply_email) {
      toast.error("Add an apply link or an apply email so candidates can reach you.");
      return;
    }
    setSubmitting(true);
    try {
      await createJob({
        data: {
          title: form.title,
          company_name: form.company_name,
          company_website: form.company_website,
          location: form.location,
          remote_type: form.remote_type as "onsite" | "remote" | "hybrid",
          employment_type: form.employment_type as
            | "full_time"
            | "part_time"
            | "contract"
            | "internship"
            | "temporary",
          experience_level: (form.experience_level || "") as
            | "entry"
            | "mid"
            | "senior"
            | "lead"
            | "executive"
            | "",
          salary_min: form.salary_min ? Number(form.salary_min) : null,
          salary_max: form.salary_max ? Number(form.salary_max) : null,
          salary_currency: form.salary_currency,
          description: form.description,
          apply_url: form.apply_url,
          apply_email: form.apply_email,
        },
      });
      toast.success("Your job is live!");
      navigate({ to: "/my-jobs" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish the job");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your listing goes live immediately and appears on the board.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job title *</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Senior Frontend Engineer"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company name *</Label>
            <Input
              id="company_name"
              required
              value={form.company_name}
              onChange={(e) => set("company_name", e.target.value)}
              placeholder="Acme Inc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_website">Company website</Label>
            <Input
              id="company_website"
              type="url"
              value={form.company_website}
              onChange={(e) => set("company_website", e.target.value)}
              placeholder="https://acme.com"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Berlin, Germany"
            />
          </div>
          <div className="space-y-2">
            <Label>Workplace *</Label>
            <Select value={form.remote_type} onValueChange={(v) => set("remote_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Employment type *</Label>
            <Select value={form.employment_type} onValueChange={(v) => set("employment_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full-time</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Experience level</Label>
            <Select value={form.experience_level} onValueChange={(v) => set("experience_level", v)}>
              <SelectTrigger><SelectValue placeholder="Any level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Salary range (yearly)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                value={form.salary_min}
                onChange={(e) => set("salary_min", e.target.value)}
                placeholder="Min"
              />
              <Input
                type="number"
                min={0}
                value={form.salary_max}
                onChange={(e) => set("salary_max", e.target.value)}
                placeholder="Max"
              />
              <Input
                className="w-24"
                maxLength={3}
                value={form.salary_currency}
                onChange={(e) => set("salary_currency", e.target.value.toUpperCase())}
                placeholder="USD"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job description *</Label>
          <Textarea
            id="description"
            required
            rows={10}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the role, responsibilities, and requirements…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="apply_url">Apply link</Label>
            <Input
              id="apply_url"
              type="url"
              value={form.apply_url}
              onChange={(e) => set("apply_url", e.target.value)}
              placeholder="https://acme.com/careers/apply"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apply_email">Apply email</Label>
            <Input
              id="apply_email"
              type="email"
              value={form.apply_email}
              onChange={(e) => set("apply_email", e.target.value)}
              placeholder="jobs@acme.com"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
          {submitting ? "Publishing…" : "Publish job"}
        </Button>
      </form>
    </div>
  );
}
