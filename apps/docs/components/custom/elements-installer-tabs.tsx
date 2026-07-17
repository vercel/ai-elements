"use client";

import { CodeBlock } from "@/components/geistdocs/code-block";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/geistdocs/code-block-tabs";
import { useUILibrary } from "@/hooks/geistdocs/use-ui-library";

interface VariantData {
  elementsCommand: string;
  shadcnCommand: string;
  highlightedCode: string;
  hasSource: boolean;
}

interface ElementsInstallerTabsProps {
  radix: VariantData;
  base: VariantData;
}

const HighlightedCodePreview = ({
  highlightedCode,
}: {
  highlightedCode: string;
}) => (
  // oxlint-disable-next-line eslint-plugin-react(no-danger)
  <pre dangerouslySetInnerHTML={{ __html: highlightedCode }} />
);

export const ElementsInstallerTabs = ({
  radix,
  base,
}: ElementsInstallerTabsProps) => {
  const { library } = useUILibrary();
  const data = library === "base" ? base : radix;

  return (
    <div className="not-prose">
      <CodeBlockTabs defaultValue="ai-elements">
        <CodeBlockTabsList>
          <CodeBlockTabsTrigger value="ai-elements">
            AI Elements
          </CodeBlockTabsTrigger>
          <CodeBlockTabsTrigger value="shadcn">shadcn CLI</CodeBlockTabsTrigger>
          {data.hasSource && (
            <CodeBlockTabsTrigger value="manual">Manual</CodeBlockTabsTrigger>
          )}
        </CodeBlockTabsList>
        <CodeBlockTab className="not-prose" value="ai-elements">
          <CodeBlock className="px-4">{data.elementsCommand}</CodeBlock>
        </CodeBlockTab>
        <CodeBlockTab className="not-prose" value="shadcn">
          <CodeBlock className="px-4">{data.shadcnCommand}</CodeBlock>
        </CodeBlockTab>
        {data.hasSource && (
          <CodeBlockTab className="not-prose" value="manual">
            <CodeBlock className="max-h-[600px] overflow-y-auto">
              <HighlightedCodePreview highlightedCode={data.highlightedCode} />
            </CodeBlock>
          </CodeBlockTab>
        )}
      </CodeBlockTabs>
    </div>
  );
};
