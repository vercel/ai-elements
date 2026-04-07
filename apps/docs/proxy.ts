import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { i18n } from "@/lib/geistdocs/i18n";
import { trackMdRequest } from "@/lib/geistdocs/md-tracking";
import { generateNotFoundMarkdown, isAIAgent } from "@vercel/agent-readability";

const { rewrite: rewriteLLM } = rewritePath(
  "/*path",
  `/${i18n.defaultLanguage}/llms.mdx/*path`
);

const MDX_EXTENSION_PATTERN = /\.mdx?$/;

const internationalizer = createI18nMiddleware(i18n);

const proxy = (request: NextRequest, context: NextFetchEvent) => {
  const pathname = request.nextUrl.pathname;

  // Track llms.txt requests
  if (pathname === "/llms.txt") {
    context.waitUntil(
      trackMdRequest({
        path: "/llms.txt",
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
        acceptHeader: request.headers.get("accept"),
      })
    );
  }

  // Handle .md/.mdx URL requests before i18n runs
  if (
    (pathname === ".md" ||
      pathname === ".mdx" ||
      pathname.startsWith("/")) &&
    (pathname.endsWith(".md") || pathname.endsWith(".mdx"))
  ) {
    const stripped = pathname.replace(MDX_EXTENSION_PATTERN, "");
    const result =
      stripped === ""
        ? `/${i18n.defaultLanguage}/llms.mdx`
        : rewriteLLM(stripped);
    if (result) {
      context.waitUntil(
        trackMdRequest({
          path: pathname,
          userAgent: request.headers.get("user-agent"),
          referer: request.headers.get("referer"),
          acceptHeader: request.headers.get("accept"),
        })
      );
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  // AI agent detection — rewrite docs pages to markdown for agents
  if (
    (pathname === "/docs" || pathname.startsWith("/docs/")) &&
    !pathname.includes("/llms.mdx/")
  ) {
    const agentResult = isAIAgent(request);
    if (agentResult.detected && !isMarkdownPreferred(request)) {
      const result = rewriteLLM(pathname);

      if (result) {
        context.waitUntil(
          trackMdRequest({
            path: pathname,
            userAgent: request.headers.get("user-agent"),
            referer: request.headers.get("referer"),
            acceptHeader: request.headers.get("accept"),
            requestType: "agent-rewrite",
            detectionMethod: agentResult.method,
          })
        );
        const response = NextResponse.rewrite(new URL(result, request.nextUrl));
        response.headers.set("Vary", "Accept");
        return response;
      }
      // Agent requested a non-existent docs URL — return helpful markdown
      return new NextResponse(
        generateNotFoundMarkdown(pathname, {
          sitemapUrl: "/sitemap.md",
          indexUrl: "/llms.txt",
        }),
        {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            Vary: "Accept",
          },
        },
      );
    }
  }


  // Handle Accept header content negotiation and track the request
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(pathname);
    if (result) {
      context.waitUntil(
        trackMdRequest({
          path: pathname,
          userAgent: request.headers.get("user-agent"),
          referer: request.headers.get("referer"),
          acceptHeader: request.headers.get("accept"),
          requestType: "header-negotiated",
        })
      );
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  // Fallback to i18n middleware
  return internationalizer(request, context);
};

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, static assets, favicon, sitemap, robots, etc.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default proxy;
