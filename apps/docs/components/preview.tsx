import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/shadcn-ui/components/ui/resizable";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

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

  return (
    <Tabs items={["Preview", "Code"]}>
      <Tab className="not-prose p-0">
        <ResizablePanelGroup direction="horizontal">
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
      </Tab>
      <Tab className="p-0">
        <div className="h-[600px] [&_.fd-scroll-container]:h-full [&_.fd-scroll-container]:max-h-none">
          <DynamicCodeBlock
            code={parsedCode}
            codeblock={{
              className: "bg-background size-full overflow-hidden border-none",
            }}
            lang="tsx"
          />
        </div>
      </Tab>
    </Tabs>
  );
};
