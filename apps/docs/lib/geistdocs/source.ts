import type { Node, Root } from "fumadocs-core/page-tree";
import type { InferPageType } from "fumadocs-core/source";

import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

import { components, docs, examples } from "@/.source/server";
import { basePath } from "@/geistdocs";

import { i18n } from "./i18n";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const docsSource = loader({
  baseUrl: "/docs",
  i18n,
  plugins: [lucideIconsPlugin()],
  source: docs.toFumadocsSource(),
});

export const componentsSource = loader({
  baseUrl: "/components",
  i18n,
  plugins: [lucideIconsPlugin()],
  source: components.toFumadocsSource(),
});

export const examplesSource = loader({
  baseUrl: "/examples",
  i18n,
  plugins: [lucideIconsPlugin()],
  source: examples.toFumadocsSource(),
});

const allSources = [docsSource, componentsSource, examplesSource] as const;

export type AnySource =
  | typeof docsSource
  | typeof componentsSource
  | typeof examplesSource;

export type AnyPage = InferPageType<AnySource>;

// Helper to get all pages across all sources
export const getAllPages = (lang?: string) =>
  allSources.flatMap((source) =>
    lang ? source.getPages(lang) : source.getPages()
  ) as AnyPage[];

// Helper to get page by URL across all sources
export const getPageByHref = (url: string, options?: { language?: string }) => {
  for (const source of allSources) {
    const result = source.getPageByHref(url, options);
    if (result?.page) {
      return result;
    }
  }
  return;
};

// Helper to prefix $id in page tree nodes to avoid key collisions
const prefixTreeIds = (nodes: Node[], prefix: string): Node[] =>
  nodes.map((node) => {
    const prefixedId = `${prefix}:${node.$id}`;

    if (node.type === "folder") {
      return {
        ...node,
        $id: prefixedId,
        children: prefixTreeIds(node.children, prefix),
      };
    }

    return { ...node, $id: prefixedId };
  });

// Helper to get combined page tree for a language
export const getCombinedPageTree = (lang: string): Root => ({
  children: [
    ...prefixTreeIds(docsSource.pageTree[lang].children, "docs"),
    ...prefixTreeIds(componentsSource.pageTree[lang].children, "components"),
    ...prefixTreeIds(examplesSource.pageTree[lang].children, "examples"),
  ],
  name: "Root",
});

// Helper to get a page by slug across all sources
export const getPage = (slugs: string[] | undefined, lang?: string) => {
  if (!slugs || slugs.length === 0) return;

  const [prefix, ...rest] = slugs;

  // Map prefix to source for LLM markdown routes
  const sourceMap: Record<string, AnySource> = {
    docs: docsSource,
    components: componentsSource,
    examples: examplesSource,
  };

  const source = sourceMap[prefix];
  if (source) {
    const page = source.getPage(rest.length > 0 ? rest : undefined, lang);
    if (page) return page as AnyPage;
  }

  // Fallback to existing behavior
  for (const src of allSources) {
    const page = src.getPage(slugs, lang);
    if (page) {
      return page as AnyPage;
    }
  }
  return;
};

// Helper to generate params across all sources
export const generateParams = (lang?: string) =>
  allSources.flatMap((source) => source.generateParams(lang));

export const getPageImage = (page: AnyPage) => {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: basePath
      ? `${basePath}/og/${segments.join("/")}`
      : `/og/${segments.join("/")}`,
  };
};

export const getLLMText = async (page: AnyPage) => {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
};
