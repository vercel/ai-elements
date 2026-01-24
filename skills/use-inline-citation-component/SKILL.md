---
name: Using the InlineCitation component from AI Elements
description: How to use the InlineCitation component to display inline citations with hover cards and source carousels.
---

# InlineCitation Component

A composable inline citation system for displaying source attributions within text. Features hover cards with source carousels, making it easy to browse multiple sources for a single claim.

## Import

```tsx
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
  InlineCitationQuote,
} from "@repo/elements/inline-citation";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `InlineCitation` | Root container wrapping cited text and card |
| `InlineCitationText` | The cited text with hover highlight |
| `InlineCitationCard` | HoverCard wrapper with instant open/close |
| `InlineCitationCardTrigger` | Badge showing hostname and source count |
| `InlineCitationCardBody` | HoverCard content container |
| `InlineCitationCarousel` | Carousel for multiple sources |
| `InlineCitationCarouselContent` | Carousel item container |
| `InlineCitationCarouselHeader` | Header with navigation controls |
| `InlineCitationCarouselIndex` | Current/total indicator (e.g., "1/3") |
| `InlineCitationCarouselItem` | Individual source slide |
| `InlineCitationCarouselPrev` | Previous button |
| `InlineCitationCarouselNext` | Next button |
| `InlineCitationSource` | Source display with title, URL, description |
| `InlineCitationQuote` | Styled blockquote for excerpts |

## Basic Usage

```tsx
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
} from "@repo/elements/inline-citation";

const sources = [
  { title: "Article 1", url: "https://example.com/1", description: "..." },
  { title: "Article 2", url: "https://example.org/2", description: "..." },
];

const CitedParagraph = () => (
  <p>
    Research shows that{" "}
    <InlineCitation>
      <InlineCitationText>AI is advancing rapidly</InlineCitationText>
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={sources.map((s) => s.url)} />
        <InlineCitationCardBody>
          <InlineCitationCarousel>
            <InlineCitationCarouselHeader>
              <InlineCitationCarouselPrev />
              <InlineCitationCarouselNext />
              <InlineCitationCarouselIndex />
            </InlineCitationCarouselHeader>
            <InlineCitationCarouselContent>
              {sources.map((source) => (
                <InlineCitationCarouselItem key={source.url}>
                  <InlineCitationSource
                    title={source.title}
                    url={source.url}
                    description={source.description}
                  />
                </InlineCitationCarouselItem>
              ))}
            </InlineCitationCarouselContent>
          </InlineCitationCarousel>
        </InlineCitationCardBody>
      </InlineCitationCard>
    </InlineCitation>
    .
  </p>
);
```

## Props Reference

### `<InlineCitationCardTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sources` | `string[]` | - | Array of source URLs (required) |
| `className` | `string` | - | Additional CSS classes |

### `<InlineCitationSource />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Source title |
| `url` | `string` | - | Source URL |
| `description` | `string` | - | Source description |
| `children` | `ReactNode` | - | Additional content |

### `<InlineCitationQuote />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Quote text |
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
