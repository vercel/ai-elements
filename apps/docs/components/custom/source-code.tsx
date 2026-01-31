import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { codeToHtml } from "shiki";
import { CodeBlock } from "../geistdocs/code-block";

interface SourceCodeProps {
  path: string;
  className?: string;
}

export const SourceCode = async ({ path, className }: SourceCodeProps) => {
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

  const parsedCode = code
    .replace(/@repo\/shadcn-ui\//g, "@/")
    .replace(/@repo\/elements\//g, "@/components/ai-elements/");

  const highlightedCode = await codeToHtml(parsedCode, {
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  return (
    <div className={className}>
      <CodeBlock className="py-4">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed." */}
        <pre dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </CodeBlock>
    </div>
  );
};
