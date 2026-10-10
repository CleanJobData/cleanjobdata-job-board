import * as React from "react";
import { Link } from "@/jb/lib/router-compat";
import { Image } from "@/jb/lib/router-compat";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/jb/components/theme/ThemeToggle";
import { Button } from "@/jb/components/ui/Button";

export function SiteHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setSignedIn(!!data.user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") setSignedIn(true);
      if (event === "SIGNED_OUT") setSignedIn(false);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

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
        <div className="container mx-auto px-4 min-h-16 py-3 flex flex-wrap items-center justify-between gap-3">
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

          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-3">
            <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Browse Jobs
            </Link>
            <a
              href="https://cleanjobdata.com/docs"
              target="_blank"
              rel="noopener"
              className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              API Docs
            </a>
            {signedIn ? (
              <>
                <Link
                  href="/my-jobs"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  My Jobs
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            )}
            <Button href="/post-job" size="sm">
              Post a Job
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>
    </>
  );
}
