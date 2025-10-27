import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

type ComponentPreviewProps = {
  path: string;
};

export const Preview = async ({ path }: ComponentPreviewProps) => {
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
    .replace(/@repo\//g, "@/components/ai-elements/");

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
      <Tab className="not-prose h-[600px]">
        <Component />
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
