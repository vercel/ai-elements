"use client";

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorTrigger,
} from "@repo/elements/model-selector";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    provider: "Anthropic",
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    provider: "Anthropic",
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    provider: "Google",
  },
];

const Example = () => {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");

  const selectedModelName =
    models.find((model) => model.id === selectedModel)?.name || "Select model";

  return (
    <div className="flex items-center justify-center p-8">
      <ModelSelector open={open} onOpenChange={setOpen}>
        <ModelSelectorTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedModelName}
            <CheckIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </ModelSelectorTrigger>
        <ModelSelectorContent>
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            <ModelSelectorGroup heading="OpenAI">
              {models
                .filter((model) => model.provider === "OpenAI")
                .map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    onSelect={() => {
                      setSelectedModel(model.id);
                      setOpen(false);
                    }}
                    value={model.id}
                  >
                    <span>{model.name}</span>
                    {selectedModel === model.id && (
                      <CheckIcon className="ml-auto size-4" />
                    )}
                  </ModelSelectorItem>
                ))}
            </ModelSelectorGroup>
            <ModelSelectorGroup heading="Anthropic">
              {models
                .filter((model) => model.provider === "Anthropic")
                .map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    onSelect={() => {
                      setSelectedModel(model.id);
                      setOpen(false);
                    }}
                    value={model.id}
                  >
                    <span>{model.name}</span>
                    {selectedModel === model.id && (
                      <CheckIcon className="ml-auto size-4" />
                    )}
                  </ModelSelectorItem>
                ))}
            </ModelSelectorGroup>
            <ModelSelectorGroup heading="Google">
              {models
                .filter((model) => model.provider === "Google")
                .map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    onSelect={() => {
                      setSelectedModel(model.id);
                      setOpen(false);
                    }}
                    value={model.id}
                  >
                    <span>{model.name}</span>
                    {selectedModel === model.id && (
                      <CheckIcon className="ml-auto size-4" />
                    )}
                  </ModelSelectorItem>
                ))}
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </div>
  );
};

export default Example;
