import { FaMagnifyingGlass, FaBolt, FaCode } from "react-icons/fa6";

const features = [
  { icon: FaMagnifyingGlass, title: "Structured search", description: "Browse by location, remote work, experience, salary, and freshness." },
  { icon: FaBolt, title: "Fresh job listings", description: "See the job posting data the API delivers in a real board." },
  { icon: FaCode, title: "Build your own", description: "Use the same API to power your own jobs experience." },
];

export function FeatureHighlights() {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 border-t border-border">
      <div className="grid gap-8 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="border-t border-border pt-5">
            <Icon className="h-5 w-5 text-primary mb-4" aria-hidden="true" />
            <h2 className="font-semibold text-lg text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}