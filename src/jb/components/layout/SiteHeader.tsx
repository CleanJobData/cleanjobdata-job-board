import * as React from "react";
import { Link } from "@/jb/lib/router-compat";
import { Image } from "@/jb/lib/router-compat";
import { ThemeToggle } from "@/jb/components/theme/ThemeToggle";

export function SiteHeader() {
  return (
    <>
      <div className="w-full bg-primary text-primary-foreground text-sm">
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-center">
          <span className="font-medium">
            Want a job board like this? Powered by the CleanJobData API.
          </span>
          <a
            href="https://cleanjobdata.com"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-4 font-semibold hover:opacity-90"
          >
            Get the API →
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="JobBoard Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold tracking-tight text-foreground">
              JobBoard
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <a
              href="https://cleanjobdata.com/docs"
              target="_blank"
              rel="noopener"
              className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              API Docs
            </a>
            <a
              href="https://cleanjobdata.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get the API
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>
    </>
  );
}
