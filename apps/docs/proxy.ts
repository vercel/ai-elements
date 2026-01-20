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

const needsBasePathCorrection = (pathname: string): boolean =>
  pathname.startsWith("/") && !pathname.startsWith(BASE_PATH);

const copyCookies = (
  source: NextResponse,
  target: NextResponse
): NextResponse => {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  return target;
};

const handleRedirectResponse = (
  response: NextResponse,
  requestUrl: string
): NextResponse | null => {
  const location = response.headers.get("location");
  if (!location) {
    return null;
  }

  try {
    const redirectUrl = new URL(location, requestUrl);
    if (!needsBasePathCorrection(redirectUrl.pathname)) {
      return null;
    }

    redirectUrl.pathname = `${BASE_PATH}${redirectUrl.pathname}`;
    console.log(
      "[Middleware] Correcting redirect from",
      location,
      "to",
      redirectUrl.href
    );

    return copyCookies(response, NextResponse.redirect(redirectUrl));
  } catch (error) {
    console.error("Failed to parse redirect URL:", error);
    return null;
  }
};

const handleRewriteResponse = (response: NextResponse): NextResponse | null => {
  const rewriteUrl = response.headers.get("x-middleware-rewrite");
  if (!rewriteUrl) {
    return null;
  }

  try {
    const parsedRewriteUrl = new URL(rewriteUrl);
    if (!needsBasePathCorrection(parsedRewriteUrl.pathname)) {
      return null;
    }

    parsedRewriteUrl.pathname = `${BASE_PATH}${parsedRewriteUrl.pathname}`;
    console.log(
      "[Middleware] Correcting rewrite from",
      rewriteUrl,
      "to",
      parsedRewriteUrl.href
    );

    const correctedResponse = NextResponse.rewrite(parsedRewriteUrl);
    copyCookies(response, correctedResponse);

    for (const [key, value] of response.headers.entries()) {
      if (!key.startsWith("x-middleware-")) {
        correctedResponse.headers.set(key, value);
      }
    }

    return correctedResponse;
  } catch (error) {
    console.error("Failed to parse rewrite URL:", error);
    return null;
  }
};

/**
 * Wraps the fumadocs i18n middleware to fix basePath handling.
 * The fumadocs middleware doesn't account for Next.js basePath when constructing
 * redirect and rewrite URLs, causing them to lose the basePath prefix.
 */
const wrapI18nMiddleware = (
  middleware: ReturnType<typeof createI18nMiddleware>
) => {
  return async (request: NextRequest, context: NextFetchEvent) => {
    console.log("[Middleware] Request path:", request.nextUrl.pathname);
    const response = await middleware(request, context);

    if (!response) {
      return null;
    }

    console.log("[Middleware] Response status:", response.status);
    console.log(
      "[Middleware] Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!(response instanceof NextResponse)) {
      return response;
    }

    const isRedirect = response.status >= 300 && response.status < 400;
    if (isRedirect) {
      const corrected = handleRedirectResponse(response, request.url);
      if (corrected) {
        return corrected;
      }
    }

    const correctedRewrite = handleRewriteResponse(response);
    if (correctedRewrite) {
      return correctedRewrite;
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
