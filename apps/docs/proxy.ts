import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { i18n } from "@/lib/geistdocs/i18n";

const { rewrite: rewriteLLM } = rewritePath("/*path", "/llms.mdx/*path");

// The basePath from next.config.ts
const BASE_PATH = "/elements";

const internationalizer = createI18nMiddleware(i18n);

/**
 * Wraps the fumadocs i18n middleware to fix basePath handling.
 * The fumadocs middleware doesn't account for Next.js basePath when constructing
 * redirect and rewrite URLs, causing them to lose the basePath prefix.
 */
const wrapI18nMiddleware = (
  middleware: ReturnType<typeof createI18nMiddleware>
) => {
  return (request: NextRequest, context: NextFetchEvent) => {
    console.log("[Middleware] Request path:", request.nextUrl.pathname);
    const response = middleware(request, context);
    console.log("[Middleware] Response status:", response.status);
    console.log(
      "[Middleware] Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Check if this is a redirect response
    if (
      response instanceof NextResponse &&
      response.status >= 300 &&
      response.status < 400
    ) {
      const location = response.headers.get("location");

      if (location) {
        try {
          const redirectUrl = new URL(location, request.url);

          // Check if the redirect URL is missing the basePath
          // (i.e., it starts with / but not with /platforms)
          if (
            redirectUrl.pathname.startsWith("/") &&
            !redirectUrl.pathname.startsWith(BASE_PATH)
          ) {
            // Add the basePath back to the redirect
            redirectUrl.pathname = `${BASE_PATH}${redirectUrl.pathname}`;
            console.log(
              "[Middleware] Correcting redirect from",
              location,
              "to",
              redirectUrl.href
            );

            // Create a new redirect response with the corrected URL
            const correctedResponse = NextResponse.redirect(redirectUrl);

            // Copy over any cookies from the original response
            response.cookies.getAll().forEach((cookie) => {
              correctedResponse.cookies.set(cookie);
            });

            return correctedResponse;
          }
        } catch (error) {
          // If URL parsing fails, return the original response
          console.error("Failed to parse redirect URL:", error);
        }
      }
    }

    // Check if this is a rewrite response
    // Rewrites are identified by the x-middleware-rewrite header
    if (response instanceof NextResponse) {
      const rewriteUrl = response.headers.get("x-middleware-rewrite");

      if (rewriteUrl) {
        try {
          const parsedRewriteUrl = new URL(rewriteUrl);

          // Check if the rewrite URL is missing the basePath
          if (
            parsedRewriteUrl.pathname.startsWith("/") &&
            !parsedRewriteUrl.pathname.startsWith(BASE_PATH)
          ) {
            // Add the basePath back to the rewrite
            parsedRewriteUrl.pathname = `${BASE_PATH}${parsedRewriteUrl.pathname}`;
            console.log(
              "[Middleware] Correcting rewrite from",
              rewriteUrl,
              "to",
              parsedRewriteUrl.href
            );

            // Create a new rewrite response with the corrected URL
            const correctedResponse = NextResponse.rewrite(parsedRewriteUrl);

            // Copy over any cookies from the original response
            response.cookies.getAll().forEach((cookie) => {
              correctedResponse.cookies.set(cookie);
            });

            // Copy over other headers
            response.headers.forEach((value, key) => {
              if (!key.startsWith("x-middleware-")) {
                correctedResponse.headers.set(key, value);
              }
            });

            return correctedResponse;
          }
        } catch (error) {
          // If URL parsing fails, return the original response
          console.error("Failed to parse rewrite URL:", error);
        }
      }
    }

    return response;
  };
};

const wrappedInternationalizer = wrapI18nMiddleware(internationalizer);

const proxy = (request: NextRequest, context: NextFetchEvent) => {
  console.log("[Proxy] Request pathname:", request.nextUrl.pathname);

  // First, handle Markdown preference rewrites
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  // Fallback to wrapped i18n middleware
  return wrappedInternationalizer(request, context);
};

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, static assets, favicon, etc.
  // Explicitly include root path and all other paths
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default proxy;
