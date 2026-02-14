// Server component - Node.js modules are valid here
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFile } from "node:fs/promises";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { join } from "node:path";
import { codeToHtml } from "shiki";

import { CodeBlock } from "@/components/geistdocs/code-block";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/geistdocs/code-block-tabs";

interface ElementsInstallerProps {
  path?: string;
}

const loadSourceCode = async (componentPath: string): Promise<string> => {
  try {
    const code = await readFile(
      join(
        process.cwd(),
        "..",
        "..",
        "packages",
        "elements",
        "src",
        `${componentPath}.tsx`
      ),
      "utf8"
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

const getCommands = (path?: string) => {
  const elementsCommand = path
    ? `npx ai-elements@latest add ${path}`
    : "npx ai-elements@latest";
  const shadcnCommand = path
    ? `npx shadcn@latest add @ai-elements/${path}`
    : "npx shadcn@latest add @ai-elements/all";
  return { elementsCommand, shadcnCommand };
};

interface HighlightedCodePreviewProps {
  highlightedCode: string;
}

const HighlightedCodePreview = ({
  highlightedCode,
}: HighlightedCodePreviewProps) => (
  // oxlint-disable-next-line eslint-plugin-react(no-danger)
  <pre dangerouslySetInnerHTML={{ __html: highlightedCode }} />
);

export const ElementsInstaller = async ({ path }: ElementsInstallerProps) => {
  const sourceCode = path ? await loadSourceCode(path) : "";
  const { elementsCommand, shadcnCommand } = getCommands(path);
  const highlightedCode = await codeToHtml(sourceCode, {
    lang: "tsx",
    themes: { dark: "github-dark", light: "github-light" },
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
              <HighlightedCodePreview highlightedCode={highlightedCode} />
            </CodeBlock>
          </CodeBlockTab>
        )}
      </CodeBlockTabs>
    </div>
  );
};
