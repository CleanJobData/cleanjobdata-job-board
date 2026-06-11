import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/jb/components/theme/ThemeProvider";
import { SiteHeader } from "@/jb/components/layout/SiteHeader";
import { SiteFooter } from "@/jb/components/layout/SiteFooter";

const THEME_INIT = `(function(){try{var k='cleanjobdata-theme';var t=localStorage.getItem(k);var d=document.documentElement;var dark=false;if(t==='dark')dark=true;else if(t==='light')dark=false;else if(window.matchMedia('(prefers-color-scheme: dark)').matches)dark=true;if(dark)d.classList.add('dark');else d.classList.remove('dark');}catch(e){}})();`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-7xl font-extrabold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "5HmW95YjfHja65nvTELhysx1d6UwVr8gf0xmQjMzL4c" },
      { title: "Jobs Posting API for Developers | CleanJobData" },
      {
        name: "description",
        content:
          "Jobs posting API for developers and companies building job boards. Fresh, structured job listings via REST — no scraping. Live demo + docs.",
      },
      { property: "og:title", content: "Jobs Posting API for Developers | CleanJobData" },
      { name: "twitter:title", content: "Jobs Posting API for Developers | CleanJobData" },
      { property: "og:description", content: "Jobs posting API for developers and companies. Build a job board in hours with structured, real-time job data. Live demo + docs." },
      { name: "twitter:description", content: "Jobs posting API for developers and companies. Build a job board in hours with structured, real-time job data. Live demo + docs." },
      { property: "og:url", content: "/" },
      { property: "og:site_name", content: "CleanJobData" },
      { name: "keywords", content: "jobs API, job posting API, job board API, job listings API, build a job board, job data API, CleanJobData" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5VRtsoHV6GPoZQpFXZo8id6KsTv2/social-images/social-1779104029923-Screenshot_2026-05-17_at_3.29.02_PM.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5VRtsoHV6GPoZQpFXZo8id6KsTv2/social-images/social-1779104029923-Screenshot_2026-05-17_at_3.29.02_PM.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CleanJobData",
          url: "https://cleanjobdata-job-board.lovable.app",
          description: "Jobs posting API for developers and companies building job boards.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CleanJobData",
          url: "https://cleanjobdata.com",
          logo: "https://cleanjobdata-job-board.lovable.app/logo.svg",
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.svg" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
