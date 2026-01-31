import type { InferPageType } from "fumadocs-core/source";
import type { NextRequest } from "next/server";
import {
  type componentsSource,
  type docsSource,
  type examplesSource,
  getLLMText,
  source,
} from "@/lib/geistdocs/source";
export const revalidate = false;

export const GET = async (
  _req: NextRequest,
  { params }: RouteContext<"/[lang]/llms.txt">
) => {
  const { lang } = await params;
  const scan = source
    .getPages(lang)
    .map((page) =>
      getLLMText(
        page as InferPageType<
          typeof docsSource | typeof componentsSource | typeof examplesSource
        >
      )
    );
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
};
