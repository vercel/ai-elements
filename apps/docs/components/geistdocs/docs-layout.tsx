import { DocsLayout as FumadocsDocsLayout } from "fumadocs-ui/layouts/docs";
import { Folder, Item, Separator } from "@/components/geistdocs/sidebar";
import { source } from "@/lib/geistdocs/source";

export const DocsLayout = ({
  children,
}: Pick<LayoutProps<"/">, "children">) => (
  <FumadocsDocsLayout
    containerProps={{
      className: "mx-0",
    }}
    nav={{
      enabled: false,
    }}
    searchToggle={{
      enabled: false,
    }}
    sidebar={{
      className: "mt-16 bg-background! border-none transition-none",
      collapsible: false,
      components: {
        Folder,
        Item,
        Separator,
      },
    }}
    tabMode="auto"
    themeSwitch={{
      enabled: false,
    }}
    tree={source.pageTree}
  >
    {children}
  </FumadocsDocsLayout>
);
