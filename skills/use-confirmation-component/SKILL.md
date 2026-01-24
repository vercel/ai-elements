---
name: Using the Confirmation component from AI Elements
description: How to use the Confirmation component to handle tool approval requests in AI conversations.
---

# Confirmation Component

The Confirmation component displays approval requests for AI tool executions, allowing users to accept or reject actions. It supports different states: pending request, accepted, and rejected.

## Import

```tsx
import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from "@repo/elements/confirmation";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Confirmation` | Root container with state context |
| `ConfirmationTitle` | Title/description of the action |
| `ConfirmationRequest` | Content shown when awaiting approval |
| `ConfirmationAccepted` | Content shown after approval |
| `ConfirmationRejected` | Content shown after rejection |
| `ConfirmationActions` | Container for action buttons |
| `ConfirmationAction` | Individual action button |

## Basic Usage

### Pending Request State

```tsx
import { CheckIcon, XIcon } from "lucide-react";

const Example = () => (
  <Confirmation approval={{ id: "tool-123" }} state="approval-requested">
    <ConfirmationTitle>
      <ConfirmationRequest>
        This tool wants to delete the file <code>/tmp/example.txt</code>. Do you approve?
      </ConfirmationRequest>
      <ConfirmationAccepted>
        <CheckIcon className="size-4 text-green-600" />
        <span>You approved this tool execution</span>
      </ConfirmationAccepted>
      <ConfirmationRejected>
        <XIcon className="size-4 text-destructive" />
        <span>You rejected this tool execution</span>
      </ConfirmationRejected>
    </ConfirmationTitle>
    <ConfirmationActions>
      <ConfirmationAction variant="outline" onClick={() => handleReject()}>
        Reject
      </ConfirmationAction>
      <ConfirmationAction variant="default" onClick={() => handleApprove()}>
        Approve
      </ConfirmationAction>
    </ConfirmationActions>
  </Confirmation>
);
```

### Accepted State

```tsx
<Confirmation
  approval={{ id: "tool-123", approved: true }}
  state="approval-responded"
>
  <ConfirmationTitle>
    <ConfirmationAccepted>
      <CheckIcon className="size-4 text-green-600" />
      <span>You approved this tool execution</span>
    </ConfirmationAccepted>
  </ConfirmationTitle>
</Confirmation>
```

### Rejected State

```tsx
<Confirmation
  approval={{ id: "tool-123", approved: false }}
  state="output-denied"
>
  <ConfirmationTitle>
    <ConfirmationRejected>
      <XIcon className="size-4 text-destructive" />
      <span>You rejected this tool execution</span>
    </ConfirmationRejected>
  </ConfirmationTitle>
</Confirmation>
```

## Props Reference

### `<Confirmation />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `approval` | `ToolUIPartApproval` | - | Approval object with id and optional approved status |
| `state` | `ToolUIPart["state"]` | Required | Current state of the tool UI part |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Alert>` | - | Alert props |

### `<ConfirmationTitle />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Title content |

### `<ConfirmationRequest />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Content for pending state |

### `<ConfirmationAccepted />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Content for accepted state |

### `<ConfirmationRejected />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Content for rejected state |

### `<ConfirmationActions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Action buttons |

### `<ConfirmationAction />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "outline" \| ...` | - | Button variant |
| `onClick` | `() => void` | - | Click handler |
| `...props` | `ComponentProps<typeof Button>` | - | Button props |

## States

The component handles these tool UI states:
- `"approval-requested"` - Shows request content and action buttons
- `"approval-responded"` - Shows accepted/rejected content based on approval
- `"output-denied"` - Shows rejected content
- `"output-available"` - Shows accepted/rejected content based on approval

## Examples

See `scripts/` folder for complete working examples.
