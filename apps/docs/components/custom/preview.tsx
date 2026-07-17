import { CodeBlock } from "@repo/elements/src/code-block";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/shadcn-ui/components/ui/resizable";
import { cn } from "@repo/shadcn-ui/lib/utils";
// Server component - Node.js modules are valid here
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFile } from "node:fs/promises";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { join } from "node:path";

import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/geistdocs/code-block-tabs";

import { PreviewLibrarySwitch } from "./preview-library-switch";

interface ComponentPreviewProps {
  path: string;
  className?: string;
}

const loadCode = async (pkg: string, path: string) => {
  try {
    return await readFile(
      join(process.cwd(), "..", "..", "packages", pkg, "src", `${path}.tsx`),
      "utf8"
    );
  } catch {
    return "";
  }
};

export const Preview = async ({ path, className }: ComponentPreviewProps) => {
  const [radixCode, baseCode] = await Promise.all([
    loadCode("examples", path),
    loadCode("examples-base", path),
  ]);

  // Dynamic imports must use inline template literals so the bundler
  // can resolve the glob pattern for each package.
  const RadixComponent = await import(`@repo/examples/src/${path}.tsx`).then(
    (m) => m.default
  );

  const BaseComponent = await import(
    `@repo/examples-base/src/${path}.tsx`
  ).then((m) => m.default);

  if (!RadixComponent) {
    throw new Error(
      `No default export found for example: ${path}. Check that @repo/examples/src/${path}.tsx exports a default component.`
    );
  }

  if (!BaseComponent) {
    throw new Error(
      `No default export found for example: ${path}. Check that @repo/examples-base/src/${path}.tsx exports a default component.`
    );
  }

  const radixParsedCode = radixCode
    .replaceAll("@repo/shadcn-ui/", "@/")
    .replaceAll("@repo/elements/", "@/components/ai-elements/");

  const baseParsedCode = baseCode
    .replaceAll("@repo/base-ui/", "@/")
    .replaceAll("@repo/elements-base/", "@/components/ai-elements/");

  const radixPreview = (
    <ResizablePanelGroup orientation="horizontal" id={`preview-radix-${path}`}>
      <ResizablePanel defaultSize={100}>
        <div className={cn("h-[600px] overflow-auto p-4", className)}>
          <RadixComponent />
        </div>
      </ResizablePanel>
      <ResizableHandle
        className="translate-x-px border-none [&>div]:shrink-0"
        withHandle
      />
      <ResizablePanel defaultSize={0} />
    </ResizablePanelGroup>
  );

  const basePreview = BaseComponent ? (
    <ResizablePanelGroup orientation="horizontal" id={`preview-base-${path}`}>
      <ResizablePanel defaultSize={100}>
        <div className={cn("h-[600px] overflow-auto p-4", className)}>
          <BaseComponent />
        </div>
      </ResizablePanel>
      <ResizableHandle
        className="translate-x-px border-none [&>div]:shrink-0"
        withHandle
      />
      <ResizablePanel defaultSize={0} />
    </ResizablePanelGroup>
  ) : null;

  return (
    <CodeBlockTabs defaultValue="preview">
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="preview">Preview</CodeBlockTabsTrigger>
        <CodeBlockTabsTrigger value="code">Code</CodeBlockTabsTrigger>
      </CodeBlockTabsList>
      <CodeBlockTab className="not-prose p-0" value="preview">
        <PreviewLibrarySwitch
          radix={radixPreview}
          base={basePreview ?? radixPreview}
        />
      </CodeBlockTab>
      <CodeBlockTab className="p-0" value="code">
        <PreviewLibrarySwitch
          radix={
            <div className="not-prose h-[600px] overflow-y-auto">
              <CodeBlock
                className="rounded-none border-0"
                code={radixParsedCode}
                language="tsx"
              />
            </div>
          }
          base={
            <div className="not-prose h-[600px] overflow-y-auto">
              <CodeBlock
                className="rounded-none border-0"
                code={baseParsedCode || radixParsedCode}
                language="tsx"
              />
            </div>
          }
        />
      </CodeBlockTab>
    </CodeBlockTabs>
  );
};
