---
name: Using the WebPreview component from AI Elements
description: How to use the WebPreview component to display an iframe-based web preview with navigation and console.
---

# WebPreview Component

A browser-like web preview component with navigation controls, URL input, iframe display, and a collapsible console for logs.

## Import

```tsx
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewConsole,
} from "@repo/elements/web-preview";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `WebPreview` | Root container providing URL state context |
| `WebPreviewNavigation` | Navigation bar container |
| `WebPreviewNavigationButton` | Toolbar button with tooltip |
| `WebPreviewUrl` | URL input field |
| `WebPreviewBody` | Iframe that displays the preview |
| `WebPreviewConsole` | Collapsible console log panel |

## Basic Usage

```tsx
const Example = () => (
  <WebPreview
    defaultUrl="https://example.com"
    onUrlChange={(url) => console.log("URL changed:", url)}
    style={{ height: "400px" }}
  >
    <WebPreviewNavigation>
      <WebPreviewNavigationButton tooltip="Go back">
        <ArrowLeftIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewNavigationButton tooltip="Go forward">
        <ArrowRightIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewNavigationButton tooltip="Reload">
        <RefreshCcwIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewUrl />
      <WebPreviewNavigationButton tooltip="Open in new tab">
        <ExternalLinkIcon className="size-4" />
      </WebPreviewNavigationButton>
    </WebPreviewNavigation>

    <WebPreviewBody />

    <WebPreviewConsole logs={consoleLogs} />
  </WebPreview>
);
```

## Props Reference

### `<WebPreview />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultUrl` | `string` | `""` | Initial URL to display |
| `onUrlChange` | `(url: string) => void` | - | Callback when URL changes |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | WebPreview sub-components |
| `...props` | `ComponentProps<"div">` | - | Standard div props |

### `<WebPreviewNavigationButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltip` | `string` | - | Tooltip text on hover |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | - | Disabled state |
| `children` | `ReactNode` | - | Button content (icon) |
| `...props` | `ComponentProps<typeof Button>` | - | Standard Button props |

### `<WebPreviewUrl />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled input value |
| `onChange` | `(event) => void` | - | Input change handler |
| `onKeyDown` | `(event) => void` | - | Key down handler (Enter navigates) |
| `...props` | `ComponentProps<typeof Input>` | - | Standard Input props |

### `<WebPreviewBody />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Override URL from context |
| `loading` | `ReactNode` | - | Loading state content |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<"iframe">` | - | Standard iframe props |

### `<WebPreviewConsole />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logs` | `Array<{ level: "log" \| "warn" \| "error"; message: string; timestamp: Date }>` | `[]` | Console log entries |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Additional content in console |

## Console Logs Example

```tsx
const consoleLogs = [
  {
    level: "log" as const,
    message: "Page loaded successfully",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    level: "warn" as const,
    message: "Deprecated API usage detected",
    timestamp: new Date(Date.now() - 5000),
  },
  {
    level: "error" as const,
    message: "Failed to load resource",
    timestamp: new Date(),
  },
];

<WebPreviewConsole logs={consoleLogs} />
```

## Context Hook

Access the preview context in custom components:

```tsx
const useWebPreview = () => {
  const context = useContext(WebPreviewContext);
  // Returns: { url, setUrl, consoleOpen, setConsoleOpen }
  return context;
};
```

## Sandbox Permissions

The iframe has these sandbox permissions:
- `allow-scripts` - JavaScript execution
- `allow-same-origin` - Same-origin requests
- `allow-forms` - Form submission
- `allow-popups` - Popup windows
- `allow-presentation` - Presentation API

## Examples

See `scripts/` folder for complete working examples.
