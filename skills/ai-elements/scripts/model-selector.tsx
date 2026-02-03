"use client";

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "o1",
    name: "o1",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "o1-mini",
    name: "o1 Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
  {
    id: "claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google", "google-vertex"],
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    chef: "Google",
    chefSlug: "google",
    providers: ["google", "google-vertex"],
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google", "google-vertex"],
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    chef: "Meta",
    chefSlug: "llama",
    providers: ["groq", "togetherai", "amazon-bedrock"],
  },
  {
    id: "llama-3.1-405b",
    name: "Llama 3.1 405B",
    chef: "Meta",
    chefSlug: "llama",
    providers: ["togetherai", "amazon-bedrock"],
  },
  {
    id: "llama-3.1-70b",
    name: "Llama 3.1 70B",
    chef: "Meta",
    chefSlug: "llama",
    providers: ["groq", "togetherai", "amazon-bedrock"],
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    chef: "Meta",
    chefSlug: "llama",
    providers: ["groq", "togetherai"],
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    chef: "DeepSeek",
    chefSlug: "deepseek",
    providers: ["deepseek", "openrouter"],
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    chef: "DeepSeek",
    chefSlug: "deepseek",
    providers: ["deepseek", "openrouter"],
  },
  {
    id: "deepseek-coder-v2",
    name: "DeepSeek Coder V2",
    chef: "DeepSeek",
    chefSlug: "deepseek",
    providers: ["deepseek", "openrouter"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    chef: "Mistral AI",
    chefSlug: "mistral",
    providers: ["mistral", "azure"],
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    chef: "Mistral AI",
    chefSlug: "mistral",
    providers: ["mistral", "azure"],
  },
  {
    id: "codestral",
    name: "Codestral",
    chef: "Mistral AI",
    chefSlug: "mistral",
    providers: ["mistral"],
  },
  {
    id: "qwen-2.5-72b",
    name: "Qwen 2.5 72B",
    chef: "Alibaba",
    chefSlug: "alibaba",
    providers: ["alibaba", "openrouter"],
  },
  {
    id: "qwen-2.5-coder-32b",
    name: "Qwen 2.5 Coder 32B",
    chef: "Alibaba",
    chefSlug: "alibaba",
    providers: ["alibaba", "openrouter"],
  },
  {
    id: "qwen-max",
    name: "Qwen Max",
    chef: "Alibaba",
    chefSlug: "alibaba",
    providers: ["alibaba"],
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    chef: "Cohere",
    chefSlug: "cohere",
    providers: ["cohere", "azure", "amazon-bedrock"],
  },
  {
    id: "command-r",
    name: "Command R",
    chef: "Cohere",
    chefSlug: "cohere",
    providers: ["cohere", "azure", "amazon-bedrock"],
  },
  {
    id: "grok-3",
    name: "Grok 3",
    chef: "xAI",
    chefSlug: "xai",
    providers: ["xai"],
  },
  {
    id: "grok-2-1212",
    name: "Grok 2 1212",
    chef: "xAI",
    chefSlug: "xai",
    providers: ["xai"],
  },
  {
    id: "grok-vision",
    name: "Grok Vision",
    chef: "xAI",
    chefSlug: "xai",
    providers: ["xai"],
  },
  {
    id: "moonshot-v1-128k",
    name: "Moonshot v1 128K",
    chef: "Moonshot AI",
    chefSlug: "moonshotai",
    providers: ["moonshotai"],
  },
  {
    id: "moonshot-v1-32k",
    name: "Moonshot v1 32K",
    chef: "Moonshot AI",
    chefSlug: "moonshotai",
    providers: ["moonshotai"],
  },
  {
    id: "sonar-pro",
    name: "Sonar Pro",
    chef: "Perplexity",
    chefSlug: "perplexity",
    providers: ["perplexity"],
  },
  {
    id: "sonar",
    name: "Sonar",
    chef: "Perplexity",
    chefSlug: "perplexity",
    providers: ["perplexity"],
  },
  {
    id: "v0-chat",
    name: "v0 Chat",
    chef: "Vercel",
    chefSlug: "v0",
    providers: ["vercel"],
  },
  {
    id: "nova-pro",
    name: "Nova Pro",
    chef: "Amazon",
    chefSlug: "amazon-bedrock",
    providers: ["amazon-bedrock"],
  },
  {
    id: "nova-lite",
    name: "Nova Lite",
    chef: "Amazon",
    chefSlug: "amazon-bedrock",
    providers: ["amazon-bedrock"],
  },
  {
    id: "nova-micro",
    name: "Nova Micro",
    chef: "Amazon",
    chefSlug: "amazon-bedrock",
    providers: ["amazon-bedrock"],
  },
];

const Example = () => {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");

  const selectedModelData = models.find((model) => model.id === selectedModel);

  // Get unique chefs in order of appearance
  const chefs = Array.from(new Set(models.map((model) => model.chef)));

  return (
    <div className="flex size-full items-center justify-center p-8">
      <ModelSelector onOpenChange={setOpen} open={open}>
        <ModelSelectorTrigger asChild>
          <Button className="w-[200px] justify-between" variant="outline">
            {selectedModelData?.chefSlug && (
              <ModelSelectorLogo provider={selectedModelData.chefSlug} />
            )}
            {selectedModelData?.name && (
              <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>
            )}
          </Button>
        </ModelSelectorTrigger>
        <ModelSelectorContent>
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            {chefs.map((chef) => (
              <ModelSelectorGroup heading={chef} key={chef}>
                {models
                  .filter((model) => model.chef === chef)
                  .map((model) => (
                    <ModelSelectorItem
                      key={model.id}
                      onSelect={() => {
                        setSelectedModel(model.id);
                        setOpen(false);
                      }}
                      value={model.id}
                    >
                      <ModelSelectorLogo provider={model.chefSlug} />
                      <ModelSelectorName>{model.name}</ModelSelectorName>
                      <ModelSelectorLogoGroup>
                        {model.providers.map((provider) => (
                          <ModelSelectorLogo
                            key={provider}
                            provider={provider}
                          />
                        ))}
                      </ModelSelectorLogoGroup>
                      {selectedModel === model.id ? (
                        <CheckIcon className="ml-auto size-4" />
                      ) : (
                        <div className="ml-auto size-4" />
                      )}
                    </ModelSelectorItem>
                  ))}
              </ModelSelectorGroup>
            ))}
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </div>
  );
};

export default Example;
