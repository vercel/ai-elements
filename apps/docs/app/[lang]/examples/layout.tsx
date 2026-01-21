import { DocsLayout } from "@/components/geistdocs/docs-layout";
import { examplesSource } from "@/lib/geistdocs/source";

const Layout = async ({
  children,
  params,
}: LayoutProps<"/[lang]/examples">) => {
  const { lang } = await params;

  return (
    <DocsLayout tree={examplesSource.pageTree[lang]}>{children}</DocsLayout>
  );
};

export default Layout;
