import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { AiSdkNav } from "@/components/navbar";
import { source } from "@/lib/source";

const Layout = ({ children }: LayoutProps<"/">) => (
  <DocsLayout
    links={[]}
    nav={{
      component: <AiSdkNav />,
    }}
    searchToggle={{
      enabled: false,
    }}
    sidebar={{
      collapsible: false,
      tabs: [],
      className: "bg-background!",
    }}
    tree={source.pageTree}
  >
    {children}
  </DocsLayout>
);

export default Layout;
