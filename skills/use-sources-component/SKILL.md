---
name: Using the Sources component from AI Elements
description: How to use the Sources component to display collapsible citation links.
---

# Sources Component

A collapsible component for displaying citation sources with links. Built on top of Radix UI's Collapsible primitive.

## Import

```tsx
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "@repo/elements/sources";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Sources` | Root container wrapping the collapsible sources section |
| `SourcesTrigger` | Clickable trigger to expand/collapse the sources list |
| `SourcesContent` | Container for the list of source links |
| `Source` | Individual source link item |

## Basic Usage

```tsx
const sources = [
  { href: "https://stripe.com/docs/api", title: "Stripe API Documentation" },
  { href: "https://docs.github.com/en/rest", title: "GitHub REST API" },
  { href: "https://docs.aws.amazon.com/sdk-for-javascript/", title: "AWS SDK for JavaScript" },
];

const Example = () => (
  <Sources>
    <SourcesTrigger count={sources.length} />
    <SourcesContent>
      {sources.map((source) => (
        <Source href={source.href} key={source.href} title={source.title} />
      ))}
    </SourcesContent>
  </Sources>
);
```

## Props Reference

### `<Sources />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<"div">` | - | Standard div props passed to Collapsible |

### `<SourcesTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | Required | Number of sources to display in the trigger text |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Custom trigger content (overrides default text) |

### `<SourcesContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof CollapsibleContent>` | - | Props passed to CollapsibleContent |

### `<Source />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | - | URL of the source link |
| `title` | `string` | - | Display title for the source |
| `children` | `ReactNode` | - | Custom content (overrides default icon + title) |
| `...props` | `ComponentProps<"a">` | - | Standard anchor props |

## Examples

See `scripts/` folder for complete working examples.
