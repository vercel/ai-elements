# Image

Displays AI-generated images from the AI SDK.

The `Image` component displays AI-generated images from the AI SDK. It accepts a [`Experimental_GeneratedImage`](/docs/reference/ai-sdk-core/generate-image) object from the AI SDK's `generateImage` function and automatically renders it as an image.

See `scripts/image.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add image
```

## Usage with AI SDK

Build a simple app allowing a user to generate an image given a prompt.

Install the `@ai-sdk/openai` package:

```package-install
npm i @ai-sdk/openai
```

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import { Image } from "@/components/ai-elements/image";
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const ImageDemo = () => {
  const [prompt, setPrompt] = useState("A futuristic cityscape at sunset");
  const [imageData, setImageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setPrompt("");

    setIsLoading(true);
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      setImageData(data);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {imageData && (
            <div className="flex justify-center">
              <Image
                {...imageData}
                alt="Generated image"
                className="h-[300px] aspect-square border rounded-lg"
              />
            </div>
          )}
          {isLoading && <Spinner />}
        </div>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={prompt}
            placeholder="Describe the image you want to generate..."
            onChange={(e) => setPrompt(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={isLoading ? "submitted" : "ready"}
            disabled={!prompt.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default ImageDemo;
```

Add the following route to your backend:

```ts title="app/api/image/route.ts"
import { openai } from "@ai-sdk/openai";
import { experimental_generateImage } from "ai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { image } = await experimental_generateImage({
    model: openai.image("dall-e-3"),
    prompt: prompt,
    size: "1024x1024",
  });

  return Response.json({
    base64: image.base64,
    uint8Array: image.uint8Array,
    mediaType: image.mediaType,
  });
}
```

## Features

- Accepts `Experimental_GeneratedImage` objects directly from the AI SDK
- Automatically creates proper data URLs from base64-encoded image data
- Supports all standard HTML image attributes
- Responsive by default with `max-w-full h-auto` styling
- Customizable with additional CSS classes
- Includes proper TypeScript types for AI SDK compatibility

## Props

### `<Image />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alt` | `string` | - | Alternative text for the image. |
| `className` | `string` | - | Additional CSS classes to apply to the image. |
| `...props` | `Experimental_GeneratedImage` | - | The image data to display, as returned by the AI SDK. |
