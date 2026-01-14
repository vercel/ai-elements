import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/shadcn-ui/components/ui/resizable";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { codeToHtml } from "shiki";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/geistdocs/code-block-tabs";
import { CodeBlock } from "../geistdocs/code-block";

type ComponentPreviewProps = {
  path: string;
  className?: string;
};

export const Preview = async ({ path, className }: ComponentPreviewProps) => {
  const code = await readFile(
    join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "examples",
      "src",
      `${path}.tsx`
    ),
    "utf-8"
  );

  const Component = await import(`@repo/examples/src/${path}.tsx`).then(
    (module) => module.default
  );

  const parsedCode = code
    .replace(/@repo\/shadcn-ui\//g, "@/")
    .replace(/@repo\/elements\//g, "@/components/ai-elements/");

  const sourceComponentNames =
    parsedCode
      .match(/@\/components\/ai-elements\/([^'"`]+)/g)
      ?.map((match) => match.replace("@/components/ai-elements/", "")) || [];

  const sourceComponents: { name: string; source: string }[] = [];

  for (const component of sourceComponentNames) {
    const fileName = component.includes("/")
      ? `${component}.tsx`
      : `${component}/index.tsx`;

    try {
      const source = await readFile(
        join(process.cwd(), "..", "..", "packages", fileName),
        "utf-8"
      );

      if (sourceComponents.some((s) => s.name === component)) {
        continue;
      }

      sourceComponents.push({ name: component, source });
    } catch {
      // skip packages that fail
    }
  }

  const highlightedCode = await codeToHtml(parsedCode, {
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  return (
    <CodeBlockTabs defaultValue="preview">
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="preview">Preview</CodeBlockTabsTrigger>
        <CodeBlockTabsTrigger value="code">Code</CodeBlockTabsTrigger>
      </CodeBlockTabsList>
      <CodeBlockTab className="not-prose p-0" value="preview">
        <ResizablePanelGroup direction="horizontal" id={`preview-${path}`}>
          <ResizablePanel defaultSize={100}>
            <div className={cn("h-[600px] overflow-auto p-4", className)}>
              <Component />
            </div>
          </ResizablePanel>
          <ResizableHandle
            className="translate-x-px border-none [&>div]:shrink-0"
            withHandle
          />
          <ResizablePanel defaultSize={0} />
        </ResizablePanelGroup>
      </CodeBlockTab>
      <CodeBlockTab className="p-0" value="code">
        <div className="not-prose h-[600px] overflow-y-auto">
          <CodeBlock className="pt-0">
            {/** biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed." */}
            <pre dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </CodeBlock>
        </div>
      </CodeBlockTab>
    </CodeBlockTabs>
  );
};
