import type { NextRequest } from "next/server";
import { getAllPages, getLLMText } from "@/lib/geistdocs/source";

export const revalidate = false;

export const GET = async (
  _req: NextRequest,
  { params }: RouteContext<"/[lang]/llms.txt">
) => {
  const { lang } = await params;
  const pages = getAllPages(lang);
  const scan = pages.map((page) => getLLMText(page));
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
};
