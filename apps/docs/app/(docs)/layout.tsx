import { DocsLayout } from "@/components/geistdocs/docs-layout";

const Layout = ({ children }: LayoutProps<"/">) => (
  <DocsLayout>{children}</DocsLayout>
);

export default Layout;
