"use client";

import ChatGPTExample from "@repo/examples/demo-chatgpt";
import ClaudeExample from "@repo/examples/demo-claude";
import GrokExample from "@repo/examples/demo-grok";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shadcn-ui/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";

const tabs = [
  {
    name: "ChatGPT",
    value: "chatgpt",
    icon: "https://github.com/openai.png",
    alt: "OpenAI",
    content: <ChatGPTExample />,
  },
  {
    name: "Claude",
    value: "claude",
    icon: "https://github.com/anthropics.png",
    alt: "Anthropic",
    content: <ClaudeExample />,
  },
  {
    name: "Grok",
    value: "grok",
    icon: "https://github.com/xai-org.png",
    alt: "X AI",
    content: <GrokExample />,
  },
];

export const ElementsDemo = () => {
  const [selectedTab, setSelectedTab] = useState("chatgpt");

  return (
    <Tabs
      className="w-full"
      defaultValue="chatgpt"
      onValueChange={setSelectedTab}
      value={selectedTab}
    >
      <TabsList className="w-fit gap-2 bg-transparent shadow-none">
        {tabs.map((tab) => (
          <TabsTrigger
            className="flex-auto shrink-0 rounded-full bg-transparent transition-colors hover:bg-secondary data-[state=active]:bg-secondary"
            key={tab.value}
            value={tab.value}
          >
            <Image
              alt={tab.alt}
              className="rounded-full ring-1 ring-border"
              height={16}
              src={tab.icon}
              unoptimized
              width={16}
            />
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="not-prose not-fumadocs-codeblock h-[600px] overflow-y-auto rounded-md border">
            {tab.content}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
