import * as React from "react";
import {
  Link as TanLink,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  scroll?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, scroll: _scroll, prefetch: _prefetch, replace, children, ...rest }, ref) => {
    return (
      <TanLink
        to={href as never}
        replace={replace}
        ref={ref as never}
        {...(rest as Record<string, unknown>)}
      >
        {children as never}
      </TanLink>
    );
  },
);
Link.displayName = "Link";

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number | string;
  height?: number | string;
}

export function Image({ width, height, alt = "", ...props }: ImageProps) {
  return <img width={width} height={height} alt={alt} {...props} />;
}

function parseUrl(url: string): { path: string; search: Record<string, string> } {
  const [path, qs] = url.split("?");
  const search: Record<string, string> = {};
  if (qs) {
    new URLSearchParams(qs).forEach((v, k) => {
      search[k] = v;
    });
  }
  return { path: path || "/", search };
}

export function useRouter() {
  const navigate = useNavigate();
  return React.useMemo(
    () => ({
      push: (url: string, _opts?: { scroll?: boolean }) => {
        const { path, search } = parseUrl(url);
        navigate({ to: path as never, search: search as never });
      },
      replace: (url: string, _opts?: { scroll?: boolean }) => {
        const { path, search } = parseUrl(url);
        navigate({ to: path as never, search: search as never, replace: true });
      },
      back: () => {
        if (typeof window !== "undefined") window.history.back();
      },
      forward: () => {
        if (typeof window !== "undefined") window.history.forward();
      },
      refresh: () => {
        if (typeof window !== "undefined") window.location.reload();
      },
    }),
    [navigate],
  );
}

export function usePathname(): string {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams(): URLSearchParams {
  const location = useLocation();
  const searchStr =
    (location as { searchStr?: string }).searchStr ??
    (typeof window !== "undefined" ? window.location.search : "");
  return React.useMemo(
    () => new URLSearchParams(searchStr.startsWith("?") ? searchStr.slice(1) : searchStr),
    [searchStr],
  );
}
