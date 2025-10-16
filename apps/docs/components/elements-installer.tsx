import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

type ElementsInstallerProps = {
  path?: string;
};

export const ElementsInstaller = async ({ path }: ElementsInstallerProps) => {
  let sourceCode = "";

  if (path) {
    try {
      const code = await readFile(
        join(process.cwd(), "components/ai-elements", `${path}.tsx`),
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

  return (
    <div className="not-prose">
      <Tabs
        items={["ai-elements", "shadcn", ...(sourceCode ? ["manual"] : [])]}
      >
        <Tab>
          <DynamicCodeBlock
            code={elementsCommand}
            codeblock={{
              className: "bg-background",
            }}
            lang="bash"
          />
        </Tab>
        <Tab>
          <DynamicCodeBlock
            code={shadcnCommand}
            codeblock={{
              className: "bg-background",
            }}
            lang="bash"
          />
        </Tab>
        {sourceCode && (
          <Tab>
            <DynamicCodeBlock
              code={sourceCode}
              codeblock={{
                className: "bg-background",
              }}
              lang="tsx"
            />
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
