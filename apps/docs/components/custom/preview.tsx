import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { CodeBlock } from "@repo/elements/src/code-block";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/shadcn-ui/components/ui/resizable";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/geistdocs/code-block-tabs";

interface ComponentPreviewProps {
  path: string;
  className?: string;
}

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
          <CodeBlock
            className="rounded-none border-0"
            code={parsedCode}
            language="tsx"
          />
        </div>
      </CodeBlockTab>
    </CodeBlockTabs>
  );
};
