// Server component - Node.js modules are valid here
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFile } from "node:fs/promises";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { join } from "node:path";
import { codeToHtml } from "shiki";

import { ElementsInstallerTabs } from "./elements-installer-tabs";

interface ElementsInstallerProps {
  path?: string;
}

const loadSourceCode = async (
  packageName: string,
  componentPath: string
): Promise<string> => {
  try {
    const code = await readFile(
      join(
        process.cwd(),
        "..",
        "..",
        "packages",
        packageName,
        "src",
        `${componentPath}.tsx`
      ),
      "utf-8"
    );
    return code
      .replaceAll("@ai-studio/shadcn-ui/", "@/")
      .replaceAll("@ai-studio/", "@/components/ai-elements/");
  } catch (error) {
    console.error(
      `Failed to load component from path: ${componentPath}`,
      error
    );
    return "";
  }
};

const getCommands = (path?: string, variant?: "radix" | "base") => {
  const registryPrefix =
    variant === "base" ? "@ai-elements/base/" : "@ai-elements/";
  const elementsCommand = path
    ? `npx ai-elements@latest add ${path}`
    : "npx ai-elements@latest";
  const shadcnCommand = path
    ? `npx shadcn@latest add ${registryPrefix}${path}`
    : `npx shadcn@latest add ${registryPrefix}all`;
  return { elementsCommand, shadcnCommand };
};

export const ElementsInstaller = async ({ path }: ElementsInstallerProps) => {
  const [radixSource, baseSource] = await Promise.all([
    path ? loadSourceCode("elements", path) : Promise.resolve(""),
    path ? loadSourceCode("elements-base", path) : Promise.resolve(""),
  ]);

  const radixCommands = getCommands(path, "radix");
  const baseCommands = getCommands(path, "base");

  const [radixHighlighted, baseHighlighted] = await Promise.all([
    radixSource
      ? codeToHtml(radixSource, {
          lang: "tsx",
          themes: { dark: "github-dark", light: "github-light" },
        })
      : Promise.resolve(""),
    baseSource
      ? codeToHtml(baseSource, {
          lang: "tsx",
          themes: { dark: "github-dark", light: "github-light" },
        })
      : Promise.resolve(""),
  ]);

  return (
    <ElementsInstallerTabs
      radix={{
        elementsCommand: radixCommands.elementsCommand,
        shadcnCommand: radixCommands.shadcnCommand,
        highlightedCode: radixHighlighted,
        hasSource: Boolean(radixSource),
      }}
      base={{
        elementsCommand: baseCommands.elementsCommand,
        shadcnCommand: baseCommands.shadcnCommand,
        highlightedCode: baseHighlighted,
        hasSource: Boolean(baseSource),
      }}
    />
  );
};
