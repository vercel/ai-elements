---
name: Using the SchemaDisplay component from AI Elements
description: How to use the SchemaDisplay component to display API endpoint schemas with parameters, request body, and response.
---

# SchemaDisplay Component

A comprehensive component for displaying API endpoint schemas including HTTP method, path, parameters, request body, and response body with collapsible sections and nested property support.

## Import

```tsx
import {
  SchemaDisplay,
  SchemaDisplayHeader,
  SchemaDisplayMethod,
  SchemaDisplayPath,
  SchemaDisplayDescription,
  SchemaDisplayContent,
  SchemaDisplayParameters,
  SchemaDisplayParameter,
  SchemaDisplayRequest,
  SchemaDisplayResponse,
  SchemaDisplayBody,
  SchemaDisplayProperty,
  SchemaDisplayExample,
} from "@repo/elements/schema-display";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `SchemaDisplay` | Root container with context provider |
| `SchemaDisplayHeader` | Header section for method and path |
| `SchemaDisplayMethod` | HTTP method badge (GET, POST, etc.) |
| `SchemaDisplayPath` | Endpoint path with parameter highlighting |
| `SchemaDisplayDescription` | Endpoint description text |
| `SchemaDisplayContent` | Main content container |
| `SchemaDisplayParameters` | Collapsible parameters section |
| `SchemaDisplayParameter` | Individual parameter row |
| `SchemaDisplayRequest` | Collapsible request body section |
| `SchemaDisplayResponse` | Collapsible response body section |
| `SchemaDisplayBody` | Generic body container |
| `SchemaDisplayProperty` | Schema property with nested support |
| `SchemaDisplayExample` | Code example block |

## Basic Usage

```tsx
import { SchemaDisplay } from "@repo/elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="GET"
    path="/api/users"
    description="List all users"
  />
);
```

## Advanced Usage

```tsx
import {
  SchemaDisplay,
  SchemaDisplayContent,
  SchemaDisplayDescription,
  SchemaDisplayHeader,
  SchemaDisplayMethod,
  SchemaDisplayParameters,
  SchemaDisplayPath,
  SchemaDisplayRequest,
  SchemaDisplayResponse,
} from "@repo/elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="POST"
    path="/api/users/{userId}/posts"
    description="Create a new post"
    parameters={[
      { name: "userId", type: "string", required: true, location: "path" },
      { name: "draft", type: "boolean", location: "query" },
    ]}
    requestBody={[
      { name: "title", type: "string", required: true },
      { name: "content", type: "string", required: true },
    ]}
    responseBody={[
      { name: "id", type: "string", required: true },
      { name: "createdAt", type: "string", required: true },
    ]}
  >
    <SchemaDisplayHeader>
      <div className="flex items-center gap-3">
        <SchemaDisplayMethod />
        <SchemaDisplayPath />
      </div>
    </SchemaDisplayHeader>
    <SchemaDisplayDescription />
    <SchemaDisplayContent>
      <SchemaDisplayParameters />
      <SchemaDisplayRequest />
      <SchemaDisplayResponse />
    </SchemaDisplayContent>
  </SchemaDisplay>
);
```

## Props Reference

### `<SchemaDisplay />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `"GET" \| "POST" \| "PUT" \| "PATCH" \| "DELETE"` | - | HTTP method (required) |
| `path` | `string` | - | Endpoint path (required) |
| `description` | `string` | - | Endpoint description |
| `parameters` | `SchemaParameter[]` | - | URL/query parameters |
| `requestBody` | `SchemaProperty[]` | - | Request body schema |
| `responseBody` | `SchemaProperty[]` | - | Response body schema |

### SchemaParameter Type
```tsx
interface SchemaParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  location?: "path" | "query" | "header";
}
```

### SchemaProperty Type
```tsx
interface SchemaProperty {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: SchemaProperty[];  // For nested objects
  items?: SchemaProperty;         // For arrays
}
```

## Method Colors

| Method | Color |
|--------|-------|
| GET | Green |
| POST | Blue |
| PUT | Orange |
| PATCH | Yellow |
| DELETE | Red |

## Examples

See `scripts/` folder for complete working examples.
