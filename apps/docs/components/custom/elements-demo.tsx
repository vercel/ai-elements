import ChatGPTExample from "@repo/examples/demo-chatgpt";
import ClaudeExample from "@repo/examples/demo-claude";
import GrokExample from "@repo/examples/demo-grok";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/geistdocs/code-block-tabs";

const tabs = [
  {
    name: "ChatGPT",
    alt: "OpenAI",
    content: <ChatGPTExample />,
  },
  {
    name: "Claude",
    alt: "Anthropic",
    content: <ClaudeExample />,
  },
  {
    name: "Grok",
    alt: "X AI",
    content: <GrokExample />,
  },
];

export const ElementsDemo = () => (
  <CodeBlockTabs defaultValue={tabs[0].name}>
    <CodeBlockTabsList>
      {tabs.map((tab) => (
        <CodeBlockTabsTrigger key={tab.name} value={tab.name}>
          {tab.name}
        </CodeBlockTabsTrigger>
      ))}
    </CodeBlockTabsList>
    {tabs.map((tab) => (
      <CodeBlockTab
        className="not-prose not-fumadocs-codeblock h-[600px] overflow-y-auto p-0"
        key={tab.name}
        value={tab.name}
      >
        {tab.content}
      </CodeBlockTab>
    ))}
  </CodeBlockTabs>
);
