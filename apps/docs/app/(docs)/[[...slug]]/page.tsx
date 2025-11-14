import {
  DocsPage,
  generatePageMetadata,
  generateStaticPageParams,
} from "@/components/geistdocs/docs-page";

const Page = async (props: PageProps<"/[[...slug]]">) => {
  const params = await props.params;

  return <DocsPage slug={params.slug} />;
};

export const generateStaticParams = generateStaticPageParams;

export const generateMetadata = async (props: PageProps<"/[[...slug]]">) => {
  const params = await props.params;

  return generatePageMetadata(params.slug);
};

export default Page;
