import { notFound } from "next/navigation";

import { generateParams, getLLMText, getPage } from "@/lib/geistdocs/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/[lang]/llms.mdx/[[...slug]]">
) {
  const { slug, lang } = await params;
  const page = getPage(slug, lang);

  if (!page) {
    notFound();
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}

export const generateStaticParams = async ({
  params,
}: RouteContext<"/[lang]/llms.mdx/[[...slug]]">) => {
  const { lang } = await params;

  return generateParams(lang);
};
