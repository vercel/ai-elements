# Mic Selector

A composable dropdown component for selecting audio input devices with permission handling and device change detection.

The `MicSelector` component provides a flexible and composable interface for selecting microphone input devices. Built on shadcn/ui's Command and Popover components, it features automatic device detection, permission handling, dynamic device list updates, and intelligent device name parsing.

See `scripts/mic-selector.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add mic-selector
```

## Features

- Fully composable architecture with granular control components
- Automatic audio input device enumeration
- Permission-based device name display
- Real-time device change detection via devicechange events
- Intelligent device label parsing with ID extraction
- Controlled and uncontrolled component patterns
- Responsive width matching between trigger and content
- Built on shadcn/ui Command and Popover components
- Full TypeScript support with proper types for all components

## Props

### `<MicSelector />`

Root Popover component that provides context for all child components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | The default selected device ID (uncontrolled). |
| `value` | `string` | - | The selected device ID (controlled). |
| `onValueChange` | `(deviceId: string) => void` | - | Callback fired when the selected device changes. |
| `defaultOpen` | `boolean` | `false` | The default open state (uncontrolled). |
| `open` | `boolean` | - | The open state (controlled). |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when the open state changes. Automatically requests microphone permission when opened without permission. |
| `...props` | `React.ComponentProps<typeof Popover>` | - | Any other props are spread to the Popover component. |

### `<MicSelectorTrigger />`

Button that opens the microphone selector popover. Automatically tracks its width to match the popover content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the Button component. |

### `<MicSelectorValue />`

Displays the currently selected microphone name or a placeholder.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<MicSelectorContent />`

Container for the Command component, rendered inside the popover.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `popoverOptions` | `React.ComponentProps<typeof PopoverContent>` | - | Props to pass to the underlying PopoverContent component. |
| `...props` | `React.ComponentProps<typeof Command>` | - | Any other props are spread to the Command component. |

### `<MicSelectorInput />`

Search input for filtering microphones.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandInput>` | - | Any other props are spread to the CommandInput component. |

### `<MicSelectorList />`

Wrapper for the list of microphone items. Uses render props pattern to provide access to device data.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `(devices: MediaDeviceInfo[]) => ReactNode` | - | Render function that receives the array of available devices. |
| `...props` | `Omit<React.ComponentProps<typeof CommandList>, ` | - | Any other props are spread to the CommandList component. |

### `<MicSelectorEmpty />`

Message shown when no microphones match the search.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The message to display. |
| `...props` | `React.ComponentProps<typeof CommandEmpty>` | - | Any other props are spread to the CommandEmpty component. |

### `<MicSelectorItem />`

Selectable item representing a microphone.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The device ID for this item. |
| `...props` | `React.ComponentProps<typeof CommandItem>` | - | Any other props are spread to the CommandItem component. |

### `<MicSelectorLabel />`

Displays a formatted microphone label with intelligent device ID parsing. Automatically extracts and styles device IDs in the format (XXXX:XXXX).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `device` | `MediaDeviceInfo` | - | The MediaDeviceInfo object for the device. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

## Hooks

### `useAudioDevices()`

A custom hook for managing audio input devices. This hook is used internally by the `MicSelector` component but can also be used independently.

```tsx
import { useAudioDevices } from "@repo/elements/mic-selector";

export default function Example() {
  const { devices, loading, error, hasPermission, loadDevices } =
    useAudioDevices();

  return (
    <div>
      {loading && <p>Loading devices...</p>}
      {error && <p>Error: {error}</p>}
      {devices.map((device) => (
        <div key={device.deviceId}>{device.label}</div>
      ))}
      {!hasPermission && (
        <button onClick={loadDevices}>Grant Permission</button>
      )}
    </div>
  );
}
```

#### Return Value

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `devices` | `MediaDeviceInfo[]` | - | Array of available audio input devices. |
| `loading` | `boolean` | - | Whether devices are currently being loaded. |
| `error` | `string | null` | - | Error message if device loading failed. |
| `hasPermission` | `boolean` | - | Whether microphone permission has been granted. |
| `loadDevices` | `() => Promise<void>` | - | Function to request microphone permission and load device names. |

## Behavior

### Permission Handling

The component implements a two-stage permission approach:

1. **Without Permission**: Initially loads devices without requesting permission. Device labels may show as generic names (e.g., "Microphone 1").
2. **With Permission**: When the popover is opened and permission hasn't been granted, automatically requests microphone access and displays actual device names.

### Device Label Parsing

The `MicSelectorLabel` component intelligently parses device names that include hardware IDs in the format `(XXXX:XXXX)`. It splits the label into the device name and ID, styling the ID with muted text for better readability.

For example: `"MacBook Pro Microphone (1a2b:3c4d)"` becomes:

- Device name: `"MacBook Pro Microphone"`
- Device ID: `"(1a2b:3c4d)"` (styled with muted color)

### Width Synchronization

The `MicSelectorTrigger` uses a ResizeObserver to track its width and automatically synchronizes it with the `MicSelectorContent` popover width for a cohesive appearance.

### Device Change Detection

The component listens for `devicechange` events (e.g., plugging/unplugging microphones) and automatically updates the device list in real-time.

## Accessibility

- Uses semantic HTML with proper ARIA attributes via shadcn/ui components
- Full keyboard navigation support through Command component
- Screen reader friendly with proper labels and roles
- Searchable device list for quick selection

## Notes

- Requires a secure context (HTTPS or localhost) for microphone access
- Browser may prompt user for microphone permission on first open
- Device labels are only fully descriptive after permission is granted
- Component handles cleanup of temporary media streams during permission requests
- Uses Radix UI's `useControllableState` for flexible controlled/uncontrolled patterns
