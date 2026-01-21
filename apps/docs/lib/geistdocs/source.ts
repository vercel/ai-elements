import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { components, docs, examples } from "@/.source/server";
import { basePath } from "@/geistdocs";
import { i18n } from "./i18n";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const docsSource = loader({
  i18n,
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const componentsSource = loader({
  i18n,
  baseUrl: "/components",
  source: components.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const examplesSource = loader({
  i18n,
  baseUrl: "/examples",
  source: examples.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const getPageImage = (
  page: InferPageType<
    typeof docsSource | typeof componentsSource | typeof examplesSource
  >
) => {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: basePath
      ? `${basePath}/og/${segments.join("/")}`
      : `/og/${segments.join("/")}`,
  };
};

export const getLLMText = async (
  page: InferPageType<
    typeof docsSource | typeof componentsSource | typeof examplesSource
  >
) => {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
};
