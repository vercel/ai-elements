import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { codeToHtml } from "shiki";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/geistdocs/code-block-tabs";
import { CodeBlock } from "../geistdocs/code-block";

type ElementsInstallerProps = {
  path?: string;
};

export const ElementsInstaller = async ({ path }: ElementsInstallerProps) => {
  let sourceCode = "";

  if (path) {
    try {
      const code = await readFile(
        join(
          process.cwd(),
          "..",
          "..",
          "packages",
          "elements",
          "src",
          `${path}.tsx`
        ),
        "utf-8"
      );

      sourceCode = code
        .replace(/@ai-studio\/shadcn-ui\//g, "@/")
        .replace(/@ai-studio\//g, "@/components/ai-elements/");
    } catch (error) {
      console.error(`Failed to load component from path: ${path}`, error);
    }
  }

  // Use string keys for shadcn/ui tabs
  const tabs = ["ai-elements", "shadcn"];

  let elementsCommand = "npx ai-elements@latest";
  let shadcnCommand = "npx shadcn@latest add @ai-elements/all";

  if (path) {
    elementsCommand += ` add ${path}`;
    shadcnCommand = `npx shadcn@latest add @ai-elements/${path}`;
  }

  if (sourceCode) {
    tabs.push("manual");
  }

  const highlightedCode = await codeToHtml(sourceCode, {
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  return (
    <div className="not-prose">
      <CodeBlockTabs defaultValue="ai-elements">
        <CodeBlockTabsList>
          <CodeBlockTabsTrigger value="ai-elements">
            AI Elements
          </CodeBlockTabsTrigger>
          <CodeBlockTabsTrigger value="shadcn">shadcn CLI</CodeBlockTabsTrigger>
          {sourceCode && (
            <CodeBlockTabsTrigger value="manual">Manual</CodeBlockTabsTrigger>
          )}
        </CodeBlockTabsList>
        <CodeBlockTab className="not-prose" value="ai-elements">
          <CodeBlock className="px-4">{elementsCommand}</CodeBlock>
        </CodeBlockTab>
        <CodeBlockTab className="not-prose" value="shadcn">
          <CodeBlock className="px-4">{shadcnCommand}</CodeBlock>
        </CodeBlockTab>
        {sourceCode && (
          <CodeBlockTab className="not-prose" value="manual">
            <CodeBlock className="max-h-[600px] overflow-y-auto">
              {/** biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed." */}
              <pre dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </CodeBlock>
          </CodeBlockTab>
        )}
      </CodeBlockTabs>
    </div>
  );
};
