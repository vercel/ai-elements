import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from "@repo/elements/open-in-chat";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { ChevronDownIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyMarkdown } from "@/components/copy-markdown";
import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const MDXContent = page.data.body;
  const parsedUrl = page.url === "/" ? "/index" : page.url;
  const markdownUrl = `/elements${parsedUrl}.mdx`;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const fullMarkdownUrl = new URL(
    markdownUrl,
    `${protocol}://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  );
  const query = `Read ${fullMarkdownUrl}, I want to ask questions about it.`;
  const text = await getLLMText(page);

  return (
    <DocsPage
      container={{
        className: "max-w-[75rem]",
      }}
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
      }}
      toc={page.data.toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="-mt-8 mb-8 flex flex-row items-center gap-2">
        <CopyMarkdown text={text} />
        <OpenIn query={query}>
          <OpenInTrigger>
            <Button size="sm" type="button" variant="outline">
              Open in
              <ChevronDownIcon className="size-4" />
            </Button>
          </OpenInTrigger>
          <OpenInContent
            align="end"
            alignOffset={-36}
            collisionPadding={8}
            side="bottom"
            sideOffset={8}
          >
            <OpenInv0 />
            <OpenInSeparator />
            <OpenInChatGPT />
            <OpenInClaude />
            <OpenInT3 />
            <OpenInScira />
            <OpenInCursor />
          </OpenInContent>
        </OpenIn>
      </div>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async (
  props: PageProps<"/[[...slug]]">
): Promise<Metadata> => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const title = `${page.data.title} | ▲ AI Elements`;
  const description = page.data.description;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  const image = new URL(`/og?slug=${params.slug?.join("/") ?? ""}`, baseUrl);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      card: "summary_large_image",
      creator: "@vercel",
    },
  };
};
