import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ElementsDemo } from "@/components/elements-demo";
import { ElementsInstaller } from "@/components/elements-installer";
import { Preview } from "@/components/preview";

// use this function to get MDX components, you will need it for rendering MDX
export const getMDXComponents = (
  components?: MDXComponents
): MDXComponents => ({
  ...defaultMdxComponents,
  ...components,
  Preview,
  ElementsInstaller,
  ElementsDemo,
  TypeTable,
});
