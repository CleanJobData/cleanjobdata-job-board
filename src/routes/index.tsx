import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/jb/components/landing/Hero";
import { FeatureHighlights } from "@/jb/components/landing/FeatureHighlights";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jobs Posting API for Developers | CleanJobData" },
      {
        name: "description",
        content:
          "Build a job board in hours with the CleanJobData jobs posting API. Fresh, structured job listings via REST — no scraping. See the live demo and docs.",
      },
      { property: "og:title", content: "Jobs Posting API for Developers | CleanJobData" },
      { property: "og:description", content: "Build a job board in hours with the CleanJobData jobs posting API. Live demo + docs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <Hero />
      <FeatureHighlights />
    </div>
  );
}
