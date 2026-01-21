import { DocsLayout } from "@/components/geistdocs/docs-layout";
import { docsSource } from "@/lib/geistdocs/source";

const Layout = async ({ children, params }: LayoutProps<"/[lang]/docs">) => {
  const { lang } = await params;

  return <DocsLayout tree={docsSource.pageTree[lang]}>{children}</DocsLayout>;
};

export default Layout;
