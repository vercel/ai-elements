import type { Metadata } from "next";

import { Separator } from "@repo/shadcn-ui/components/ui/separator";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { notFound } from "next/navigation";

import { ElementsDemo } from "@/components/custom/elements-demo";
import { ElementsInstaller } from "@/components/custom/elements-installer";
import { Preview } from "@/components/custom/preview";
import { SourceCode } from "@/components/custom/source-code";
import { AskAI } from "@/components/geistdocs/ask-ai";
import { CopyPage } from "@/components/geistdocs/copy-page";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "@/components/geistdocs/docs-page";
import { EditSource } from "@/components/geistdocs/edit-source";
import { Feedback } from "@/components/geistdocs/feedback";
import { getMDXComponents } from "@/components/geistdocs/mdx-components";
import { OpenInChat } from "@/components/geistdocs/open-in-chat";
import { ScrollTop } from "@/components/geistdocs/scroll-top";
import {
  examplesSource,
  getLLMText,
  getPageImage,
} from "@/lib/geistdocs/source";

const Page = async ({ params }: PageProps<"/[lang]/examples/[[...slug]]">) => {
  const { slug, lang } = await params;
  const page = examplesSource.getPage(slug, lang);

  if (!page) {
    notFound();
  }

  const markdown = await getLLMText(page);
  const MDX = page.data.body;

  return (
    <DocsPage
      full={page.data.full}
      tableOfContent={{
        footer: (
          <div className="my-3 space-y-3">
            <Separator />
            <EditSource path={page.path} />
            <ScrollTop />
            <Feedback />
            <CopyPage text={markdown} />
            <AskAI href={page.url} />
            <OpenInChat href={page.url} />
          </div>
        ),
        style: "clerk",
      }}
      toc={page.data.toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(examplesSource, page),

            // Add your custom components here
            Preview,
            ElementsInstaller,
            ElementsDemo,
            SourceCode,
          })}
        />
      </DocsBody>
    </DocsPage>
  );
};

export const generateStaticParams = () => examplesSource.generateParams();

export const generateMetadata = async ({
  params,
}: PageProps<"/[lang]/examples/[[...slug]]">) => {
  const { slug, lang } = await params;
  const page = examplesSource.getPage(slug, lang);

  if (!page) {
    notFound();
  }

  const metadata: Metadata = {
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
    title: page.data.title,
    alternates: {
      types: {
        "text/markdown": `/examples/${slug}.md`,
      },
    },
  };

  return metadata;
};

export default Page;
