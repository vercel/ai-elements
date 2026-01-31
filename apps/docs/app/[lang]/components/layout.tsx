import { DocsLayout } from "@/components/geistdocs/docs-layout";
import { componentsSource } from "@/lib/geistdocs/source";

const Layout = async ({
  children,
  params,
}: LayoutProps<"/[lang]/components">) => {
  const { lang } = await params;

  return (
    <DocsLayout tree={componentsSource.pageTree[lang]}>{children}</DocsLayout>
  );
};

export default Layout;
