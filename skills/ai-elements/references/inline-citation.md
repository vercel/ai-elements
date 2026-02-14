# Inline Citation

A hoverable citation component that displays source information and quotes inline with text, perfect for AI-generated content with references.

The `InlineCitation` component provides a way to display citations inline with text content, similar to academic papers or research documents. It consists of a citation pill that shows detailed source information on hover, making it perfect for AI-generated content that needs to reference sources.

See `scripts/inline-citation.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add inline-citation
```

## Usage with AI SDK

Build citations for AI-generated content using [`experimental_generateObject`](/docs/reference/ai-sdk-ui/use-object).

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
  InlineCitationQuote,
} from "@/components/ai-elements/inline-citation";
import { Button } from "@/components/ui/button";
import { citationSchema } from "@/app/api/citation/route";

const CitationDemo = () => {
  const { object, submit, isLoading } = useObject({
    api: "/api/citation",
    schema: citationSchema,
  });

  const handleSubmit = (topic: string) => {
    submit({ prompt: topic });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => handleSubmit("artificial intelligence")}
          disabled={isLoading}
          variant="outline"
        >
          Generate AI Content
        </Button>
        <Button
          onClick={() => handleSubmit("climate change")}
          disabled={isLoading}
          variant="outline"
        >
          Generate Climate Content
        </Button>
      </div>

      {isLoading && !object && (
        <div className="text-muted-foreground">
          Generating content with citations...
        </div>
      )}

      {object?.content && (
        <div className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            {object.content.split(/(\[\d+\])/).map((part, index) => {
              const citationMatch = part.match(/\[(\d+)\]/);
              if (citationMatch) {
                const citationNumber = citationMatch[1];
                const citation = object.citations?.find(
                  (c: any) => c.number === citationNumber
                );

                if (citation) {
                  return (
                    <InlineCitation key={index}>
                      <InlineCitationCard>
                        <InlineCitationCardTrigger sources={[citation.url]} />
                        <InlineCitationCardBody>
                          <InlineCitationCarousel>
                            <InlineCitationCarouselHeader>
                              <InlineCitationCarouselPrev />
                              <InlineCitationCarouselNext />
                              <InlineCitationCarouselIndex />
                            </InlineCitationCarouselHeader>
                            <InlineCitationCarouselContent>
                              <InlineCitationCarouselItem>
                                <InlineCitationSource
                                  title={citation.title}
                                  url={citation.url}
                                  description={citation.description}
                                />
                                {citation.quote && (
                                  <InlineCitationQuote>
                                    {citation.quote}
                                  </InlineCitationQuote>
                                )}
                              </InlineCitationCarouselItem>
                            </InlineCitationCarouselContent>
                          </InlineCitationCarousel>
                        </InlineCitationCardBody>
                      </InlineCitationCard>
                    </InlineCitation>
                  );
                }
              }
              return part;
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default CitationDemo;
```

Add the following route to your backend:

```ts title="app/api/citation/route.ts"
import { streamObject } from "ai";
import { z } from "zod";

export const citationSchema = z.object({
  content: z.string(),
  citations: z.array(
    z.object({
      number: z.string(),
      title: z.string(),
      url: z.string(),
      description: z.string().optional(),
      quote: z.string().optional(),
    })
  ),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamObject({
    model: "openai/gpt-4o",
    schema: citationSchema,
    prompt: `Generate a well-researched paragraph about ${prompt} with proper citations. 
    
    Include:
    - A comprehensive paragraph with inline citations marked as [1], [2], etc.
    - 2-3 citations with realistic source information
    - Each citation should have a title, URL, and optional description/quote
    - Make the content informative and the sources credible
    
    Format citations as numbered references within the text.`,
  });

  return result.toTextStreamResponse();
}
```

## Features

- Hover interaction to reveal detailed citation information
- **Carousel navigation** for multiple citations with prev/next controls
- **Live index tracking** showing current slide position (e.g., "1/5")
- Support for source titles, URLs, and descriptions
- Optional quote blocks for relevant excerpts
- Composable architecture for flexible citation formats
- Accessible design with proper keyboard navigation
- Seamless integration with AI-generated content
- Clean visual design that doesn't disrupt reading flow
- Smart badge display showing source hostname and count

## Usage with AI SDK

Currently, there is no official support for inline citations with Streamdown or the Response component. This is because:

- There isn't any good markdown syntax for inline citations
- Language models don't naturally respond with inline citation syntax
- The AI SDK doesn't have built-in support for inline citations

### Potential Approaches

While these methods are hypothetical and not officially supported, there are two conceptual ways inline citations could work with Streamdown:

1. **Footnote conversion**: GitHub Flavored Markdown (GFM) handles footnotes using `[^1]` syntax. You could hypothetically remove the default footnote rendering and convert footnotes to inline citations instead.

2. **Custom HTML syntax**: You could add a system prompt instructing the model to use a special HTML syntax like `<citation />` and pass that as a custom component to Streamdown.

These approaches require custom implementation and are not currently supported out of the box. We will investigate official support for this use case in the future.

For now, the recommended approach is to use `experimental_useObject` (as shown in the usage example above) to generate structured citation data, then manually parse and render inline citations.

## Props

### `<InlineCitation />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the root span element. |

### `<InlineCitationText />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying span element. |

### `<InlineCitationCard />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the HoverCard component. |

### `<InlineCitationCardTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sources` | `string[]` | - | Array of source URLs. The length determines the number displayed in the badge. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying button element. |

### `<InlineCitationCardBody />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying div. |

### `<InlineCitationCarousel />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Carousel>` | - | Any other props are spread to the underlying Carousel component. |

### `<InlineCitationCarouselContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying CarouselContent component. |

### `<InlineCitationCarouselItem />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying div. |

### `<InlineCitationCarouselHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying div. |

### `<InlineCitationCarouselIndex />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying div. Children will override the default index display. |

### `<InlineCitationCarouselPrev />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CarouselPrevious>` | - | Any other props are spread to the underlying CarouselPrevious component. |

### `<InlineCitationCarouselNext />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CarouselNext>` | - | Any other props are spread to the underlying CarouselNext component. |

### `<InlineCitationSource />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | The title of the source. |
| `url` | `string` | - | The URL of the source. |
| `description` | `string` | - | A brief description of the source. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying div. |

### `<InlineCitationQuote />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying blockquote element. |
