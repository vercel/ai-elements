import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { DocsLayout as FumadocsDocsLayout } from "fumadocs-ui/layouts/docs";

import {
  Folder,
  Item,
  Separator,
  Sidebar,
} from "@/components/geistdocs/sidebar";
import { i18n } from "@/lib/geistdocs/i18n";

interface DocsLayoutProps {
  tree: ComponentProps<typeof FumadocsDocsLayout>["tree"];
  children: ReactNode;
}

export const DocsLayout = ({ tree, children }: DocsLayoutProps) => (
  <FumadocsDocsLayout
    containerProps={{
      style: {
        "--fd-docs-row-1": "4rem",
      } as CSSProperties,
    }}
    i18n={i18n}
    nav={{
      enabled: false,
    }}
    searchToggle={{
      enabled: false,
    }}
    sidebar={{
      collapsible: false,
      component: <Sidebar />,
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
    tree={tree}
  >
    {children}
  </FumadocsDocsLayout>
);
