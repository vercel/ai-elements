---
name: Using the Toolbar component from AI Elements
description: A styled toolbar component for React Flow nodes with flexible positioning and custom actions.
---

The `Toolbar` component provides a positioned toolbar that attaches to nodes in React Flow canvases. It features modern card styling with backdrop blur and flexbox layout for action buttons and controls.

<Callout>
  The Toolbar component is designed to be used with the [Node](/elements/components/node) component. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Callout>

## Installation

```bash
npx ai-elements@latest add toolbar
```

## Features

- Attaches to any React Flow node
- Bottom positioning by default
- Rounded card design with border
- Theme-aware background styling
- Flexbox layout with gap spacing
- Full TypeScript support
- Compatible with all React Flow NodeToolbar features

## Props

### `<Toolbar />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply to the toolbar. |
| `...props` | `ComponentProps<typeof NodeToolbar>` | - | Any other props from @xyflow/react NodeToolbar component (position, offset, isVisible, etc.). |