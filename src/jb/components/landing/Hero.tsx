import { Link } from "@tanstack/react-router";
import { FaArrowRight, FaCode } from "react-icons/fa6";
import { Button } from "@/jb/components/ui/Button";
import heroImage from "@/assets/job-board-hero.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[440px] sm:min-h-[510px] flex items-center overflow-hidden bg-card">
      <img src={heroImage} alt="Job listings on a laptop in a bright workspace" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover object-[60%_center]" />
      <div className="absolute inset-0 bg-background/75 sm:bg-background/55" aria-hidden="true" />
      <div className="container mx-auto relative px-4 py-12 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-primary mb-4">Powered by the CleanJobData API</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">JobBoard</h1>
          <p className="mt-5 text-lg sm:text-xl text-foreground max-w-xl leading-relaxed">Explore a live job board built with fresh, structured job postings. Make one like this with the CleanJobData API.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild><Link to="/jobs">Browse jobs <FaArrowRight className="h-4 w-4" /></Link></Button>
            <Button size="lg" variant="secondary" asChild><a href="https://cleanjobdata.com" target="_blank" rel="noopener noreferrer"><FaCode className="h-4 w-4" /> Get the API</a></Button>
          </div>
        </div>
      </div>
    </section>
  );
}