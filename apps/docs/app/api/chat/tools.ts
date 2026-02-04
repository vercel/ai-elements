import type { ToolSet, UIMessageStreamWriter } from "ai";

import { tool } from "ai";
import { initAdvancedSearch } from "fumadocs-core/search/server";
import z from "zod";

import { i18n } from "@/lib/geistdocs/i18n";
import { getAllPages, getPageByHref } from "@/lib/geistdocs/source";

const createSearchServer = (lang: string) => {
  const pages = getAllPages(lang);

  return initAdvancedSearch({
    indexes: pages.map((page) => ({
      description: page.data.description,
      id: page.url,
      structuredData: page.data.structuredData,
      title: page.data.title ?? "",
      url: page.url,
    })),
  });
};

const log = (message: string) => {
  console.log(`🤖 [Geistdocs] ${message}`);
};

const search_docs = (writer: UIMessageStreamWriter) =>
  tool({
    description: "Search through documentation content by query",
    execute: async ({ query, lang }) => {
      try {
        log(`Creating search server for language: ${lang}`);

        const searchServer = createSearchServer(lang);

        log(`Searching docs for ${query}`);

        const results = await searchServer.search(query);

        log(`Found ${results.length} results`);

        if (results.length === 0) {
          return `No documentation found for query: "${query}"`;
        }

        log(`Processing ${results.length} results...`);

        const promises = results.map(({ url }) => {
          const segments = url.split("#").at(0)?.split("/") ?? [];

          if (segments.length === 0) {
            log(`🤖 [Geistdocs] No segments found for ${url}, skipping...`);
            return null;
          }

          log(`Getting page for ${url}`);

          const result = getPageByHref(url, { language: lang });

          if (!result?.page) {
            log(`No page found for ${url}`);
            return null;
          }

          const { page } = result;

          log(
            `Found page for ${url}: ${page.data.title}, ${page.data.description}`
          );

          return {
            content: JSON.stringify(page.data.structuredData.contents),
            description: page.data.description,
            slug: page.url,
            title: page.data.title,
          };
        });

        log(`Running ${promises.length} promises...`);

        const promiseResults = await Promise.all(promises);

        log(`${promiseResults.length} promises resolved.`);

        // Collect results, then filter to ensure unique slugs
        const formattedResultsRaw = promiseResults.filter(Boolean) as {
          title: string;
          description: string;
          content: string;
          slug: string;
        }[];

        log(`Formatted ${formattedResultsRaw.length} results.`);

        // Ensure slugs are unique
        const seenSlugs = new Set<string>();
        const formattedResults = formattedResultsRaw.filter((doc) => {
          if (seenSlugs.has(doc.slug)) {
            return false;
          }
          seenSlugs.add(doc.slug);
          return true;
        });

        log(`Filtered ${formattedResults.length} results.`);

        const trimmedResults = formattedResults.slice(0, 8);

        log(`Trimmed ${trimmedResults.length} results.`);

        for (const [index, doc] of trimmedResults.entries()) {
          log(`Writing doc: ${doc.title}, ${doc.slug}`);
          writer.write({
            sourceId: `doc-${index}-${doc.slug}`,
            title: doc.title,
            type: "source-url",
            url: doc.slug,
          });
        }

        const formattedResultsString = trimmedResults
          .map(
            (doc) =>
              `**${doc.title}**\nURL: ${doc.slug}\n${
                doc.description || ""
              }\n\n${doc.content.slice(0, 1500)}${
                doc.content.length > 1500 ? "..." : ""
              }\n\n---\n`
          )
          .join("\n");

        return `Found ${trimmedResults.length} documentation pages for "${query}":\n\n${formattedResultsString}`;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        return `Error processing results: ${message}`;
      }
    },
    inputSchema: z.object({
      lang: z
        .string()
        .describe("The two letter language code of the documentation to search")
        .optional()
        .default(i18n.defaultLanguage),
      query: z.string().describe("Search query to find relevant documentation"),
    }),
  });

const get_doc_page = tool({
  description:
    'Get the full content of a specific documentation page or guide by slug. Use the exact URL path from search results (e.g., "/docs/vercel-blob/client-upload" or "/guides/how-to-build-ai-app")',
  inputSchema: z.object({
    lang: z
      .string()
      .describe("The two letter language code of the documentation to search")
      .optional()
      .default(i18n.defaultLanguage),
    slug: z
      .string()
      .describe("The slug/path of the documentation page or guide to retrieve"),
  }),
  // biome-ignore lint/suspicious/useAwait: "tool calls must be async"
  execute: async ({ slug, lang }) => {
    log(`Getting all pages for language: ${lang}`);
    const pages = getAllPages(lang);

    log(`Getting doc page for ${slug} in language: ${lang}`);
    const doc = pages.find((d) => d.url === slug || d.url.endsWith(slug));

    if (!doc) {
      return `Documentation page not found: "${slug}"`;
    }

    return `# ${doc.data.title}\n\n${
      doc.data.description ? `${doc.data.description}\n\n` : ""
    }${doc.data.structuredData.contents}`;
  },
});

const list_docs = tool({
  description: "Get a list of all available documentation pages",
  inputSchema: z.object({
    lang: z
      .string()
      .describe("The two letter language code of the documentation to search")
      .optional()
      .default(i18n.defaultLanguage),
  }),
  // biome-ignore lint/suspicious/useAwait: "tool calls must be async"
  execute: async ({ lang }) => {
    log(`Getting all pages for language: ${lang}`);
    const pages = getAllPages(lang);

    const docsList = pages
      .map(
        (doc) => `- **${doc.data.title}** (${doc.url}): ${doc.data.description}`
      )
      .join("\n");

    return `Available Documentation Pages (${pages.length} total):\n\n${docsList}`;
  },
});

export const createTools = (writer: UIMessageStreamWriter) =>
  ({
    get_doc_page,
    list_docs,
    search_docs: search_docs(writer),
  }) satisfies ToolSet;
