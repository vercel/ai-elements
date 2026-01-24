---
name: Using the EnvironmentVariables component from AI Elements
description: How to use the EnvironmentVariables component to display and manage environment variable key-value pairs with visibility toggling.
---

# EnvironmentVariables Component

A composable component for displaying environment variables with visibility toggling, copy-to-clipboard functionality, and required badges. Useful for settings pages or configuration displays in developer tools.

## Import

```tsx
import {
  EnvironmentVariables,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariablesContent,
  EnvironmentVariable,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableValue,
  EnvironmentVariableCopyButton,
  EnvironmentVariableRequired,
} from "@repo/elements/environment-variables";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `EnvironmentVariables` | Root container with visibility state management |
| `EnvironmentVariablesHeader` | Header section with border |
| `EnvironmentVariablesTitle` | Title heading (defaults to "Environment Variables") |
| `EnvironmentVariablesToggle` | Switch to show/hide all values |
| `EnvironmentVariablesContent` | Container for variable rows |
| `EnvironmentVariable` | Individual variable row with name/value context |
| `EnvironmentVariableGroup` | Flex container for grouping elements |
| `EnvironmentVariableName` | Displays the variable name |
| `EnvironmentVariableValue` | Displays the value (masked or visible) |
| `EnvironmentVariableCopyButton` | Copy button with multiple formats |
| `EnvironmentVariableRequired` | Badge indicating required variable |

## Basic Usage

```tsx
import {
  EnvironmentVariables,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariablesContent,
  EnvironmentVariable,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableValue,
  EnvironmentVariableCopyButton,
  EnvironmentVariableRequired,
} from "@repo/elements/environment-variables";

const variables = [
  { name: "API_KEY", value: "sk-1234567890", required: true },
  { name: "NODE_ENV", value: "production", required: false },
];

const EnvVarsDisplay = () => (
  <EnvironmentVariables defaultShowValues={false}>
    <EnvironmentVariablesHeader>
      <EnvironmentVariablesTitle />
      <EnvironmentVariablesToggle />
    </EnvironmentVariablesHeader>
    <EnvironmentVariablesContent>
      {variables.map((v) => (
        <EnvironmentVariable key={v.name} name={v.name} value={v.value}>
          <EnvironmentVariableGroup>
            <EnvironmentVariableName />
            {v.required && <EnvironmentVariableRequired />}
          </EnvironmentVariableGroup>
          <EnvironmentVariableGroup>
            <EnvironmentVariableValue />
            <EnvironmentVariableCopyButton copyFormat="export" />
          </EnvironmentVariableGroup>
        </EnvironmentVariable>
      ))}
    </EnvironmentVariablesContent>
  </EnvironmentVariables>
);
```

## Props Reference

### `<EnvironmentVariables />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showValues` | `boolean` | - | Controlled visibility state |
| `defaultShowValues` | `boolean` | `false` | Initial visibility state |
| `onShowValuesChange` | `(show: boolean) => void` | - | Callback when visibility changes |
| `className` | `string` | - | Additional CSS classes |

### `<EnvironmentVariable />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Variable name (required) |
| `value` | `string` | - | Variable value (required) |
| `className` | `string` | - | Additional CSS classes |

### `<EnvironmentVariableCopyButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `copyFormat` | `"name" \| "value" \| "export"` | `"value"` | What to copy |
| `timeout` | `number` | `2000` | Duration of copied state (ms) |
| `onCopy` | `() => void` | - | Callback after successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy error |

### `<EnvironmentVariableRequired />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `"Required"` | Badge text |
| `...props` | `ComponentProps<typeof Badge>` | - | All Badge props supported |

## Examples

See `scripts/` folder for complete working examples.
