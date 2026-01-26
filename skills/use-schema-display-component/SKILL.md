---
name: Using the Schema Display component from AI Elements
description: Display REST API endpoint documentation with parameters, request/response bodies.
---

The `SchemaDisplay` component visualizes REST API endpoints with HTTP methods, paths, parameters, and request/response schemas.



## Installation

```bash
npx ai-elements@latest add schema-display
```

## Features

- Color-coded HTTP methods
- Path parameter highlighting
- Collapsible parameters section
- Request/response body schemas
- Nested object property display
- Required field indicators

## Method Colors

| Method | Color |
|--------|-------|
| `GET` | Green |
| `POST` | Blue |
| `PUT` | Orange |
| `PATCH` | Yellow |
| `DELETE` | Red |

## Examples

### Basic Usage



### With Parameters



### With Request/Response Bodies



### Nested Properties



## Props

### `<SchemaDisplay />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `unknown` | - | HTTP method. |
| `path` | `string` | - | API endpoint path. |
| `description` | `string` | - | Endpoint description. |
| `parameters` | `SchemaParameter[]` | - | URL/query parameters. |
| `requestBody` | `SchemaProperty[]` | - | Request body properties. |
| `responseBody` | `SchemaProperty[]` | - | Response body properties. |

### `SchemaParameter`

```tsx
interface SchemaParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  location?: "path" | "query" | "header";
}
```

### `SchemaProperty`

```tsx
interface SchemaProperty {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: SchemaProperty[]; // For objects
  items?: SchemaProperty;        // For arrays
}
```

### Subcomponents

- `SchemaDisplayHeader` - Header container
- `SchemaDisplayMethod` - Color-coded method badge
- `SchemaDisplayPath` - Path with highlighted parameters
- `SchemaDisplayDescription` - Description text
- `SchemaDisplayContent` - Content container
- `SchemaDisplayParameters` - Collapsible parameters section
- `SchemaDisplayParameter` - Individual parameter
- `SchemaDisplayRequest` - Collapsible request body
- `SchemaDisplayResponse` - Collapsible response body
- `SchemaDisplayProperty` - Schema property (recursive)
- `SchemaDisplayExample` - Code example block
