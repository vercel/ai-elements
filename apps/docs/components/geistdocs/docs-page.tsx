import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsTitle,
  DocsPage as FumadocsDocsPage,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ElementsDemo } from "@/components/custom/elements-demo";
import { ElementsInstaller } from "@/components/custom/elements-installer";
import { Preview } from "@/components/custom/preview";
import { getMDXComponents } from "@/components/geistdocs/mdx-components";
import { TableOfContents } from "@/components/geistdocs/toc";
import { getLLMText, getPageImage, source } from "@/lib/geistdocs/source";
import { CopyPage } from "./copy-page";
import { EditSource } from "./edit-source";
import { Feedback } from "./feedback";
import { OpenInChat } from "./open-in-chat";
import { ScrollTop } from "./scroll-top";

const containerStyle = {
  "--fd-nav-height": "4rem",
} as CSSProperties;

type PageProps = {
  slug: string[] | undefined;
};

export const DocsPage = async ({ slug }: PageProps) => {
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const markdown = await getLLMText(page);

  let editOnGithubUrl: string | undefined;

  const owner = process.env.NEXT_PUBLIC_GEISTDOCS_OWNER;
  const repo = process.env.NEXT_PUBLIC_GEISTDOCS_REPO;
  const path = page.path;

  if (owner && repo && path) {
    editOnGithubUrl = `https://github.com/${owner}/${repo}/edit/main/apps/docs/content/docs/${path}`;
  }

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const url = new URL(
    page.url,
    `${protocol}://${process.env.BASE_URL}`
  ).toString();
  const query = `Read this page, I want to ask questions about it. ${url}`;

  return (
    <FumadocsDocsPage
      article={{ className: "max-w-[754px]" }}
      container={{ style: containerStyle }}
      full={page.data.full}
      tableOfContent={{
        component: (
          <TableOfContents>
            <EditSource url={editOnGithubUrl} />
            <ScrollTop />
            <Feedback />
            <CopyPage text={markdown} />
            {/* <AskAI query={query} /> */}
            <OpenInChat query={query} />
          </TableOfContents>
        ),
      }}
      toc={page.data.toc}
    >
      <DocsTitle className="text-4xl tracking-tight">
        {page.data.title}
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="mx-auto w-full">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            Preview,
            ElementsInstaller,
            ElementsDemo,
          })}
        />
      </DocsBody>
    </FumadocsDocsPage>
  );
};

export const generateStaticPageParams = () => source.generateParams();

export const generatePageMetadata = (slug: PageProps["slug"]) => {
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const metadata: Metadata = {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };

  return metadata;
};
