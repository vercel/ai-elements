import ChatGPTExample from "@repo/examples/demo-chatgpt";
import ClaudeExample from "@repo/examples/demo-claude";
import GrokExample from "@repo/examples/demo-grok";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

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
  <Tabs className="w-full" items={tabs.map((tab) => tab.name)}>
    {tabs.map((tab) => (
      <Tab
        className="not-prose not-fumadocs-codeblock h-[600px] overflow-y-auto p-0"
        key={tab.name}
      >
        {tab.content}
      </Tab>
    ))}
  </Tabs>
);
