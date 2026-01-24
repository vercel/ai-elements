---
name: Using the MicSelector component from AI Elements
description: How to use the MicSelector component to select audio input devices (microphones) with permission handling.
---

# MicSelector Component

A composable microphone selector for voice/audio input. Handles device enumeration, permission requests, and provides a searchable dropdown interface. Built on shadcn/ui Command and Popover components.

## Import

```tsx
import {
  MicSelector,
  MicSelectorTrigger,
  MicSelectorContent,
  MicSelectorInput,
  MicSelectorList,
  MicSelectorEmpty,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorValue,
  useAudioDevices,
} from "@repo/elements/mic-selector";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `MicSelector` | Root with device state and popover control |
| `MicSelectorTrigger` | Button that opens the selector |
| `MicSelectorContent` | Popover content with Command wrapper |
| `MicSelectorInput` | Search input for filtering devices |
| `MicSelectorList` | Render prop container for device list |
| `MicSelectorEmpty` | Empty state when no devices found |
| `MicSelectorItem` | Individual device option |
| `MicSelectorLabel` | Formatted device label (strips device ID) |
| `MicSelectorValue` | Selected device display |
| `useAudioDevices` | Hook for device enumeration and permissions |

## Basic Usage

```tsx
import {
  MicSelector,
  MicSelectorTrigger,
  MicSelectorContent,
  MicSelectorInput,
  MicSelectorList,
  MicSelectorEmpty,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorValue,
} from "@repo/elements/mic-selector";

const MicrophonePicker = () => (
  <MicSelector
    onValueChange={(deviceId) => console.log("Selected:", deviceId)}
  >
    <MicSelectorTrigger className="w-full max-w-sm">
      <MicSelectorValue />
    </MicSelectorTrigger>
    <MicSelectorContent>
      <MicSelectorInput />
      <MicSelectorEmpty />
      <MicSelectorList>
        {(devices) =>
          devices.map((device) => (
            <MicSelectorItem key={device.deviceId} value={device.deviceId}>
              <MicSelectorLabel device={device} />
            </MicSelectorItem>
          ))
        }
      </MicSelectorList>
    </MicSelectorContent>
  </MicSelector>
);
```

## Props Reference

### `<MicSelector />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | Initial device ID |
| `value` | `string` | - | Controlled device ID |
| `onValueChange` | `(value: string \| undefined) => void` | - | Selection callback |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state callback |

### `<MicSelectorTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Trigger content (usually MicSelectorValue) |
| `...props` | `ComponentProps<typeof Button>` | - | All Button props |

### `<MicSelectorContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `popoverOptions` | `ComponentProps<typeof PopoverContent>` | - | Popover customization |
| `...props` | `ComponentProps<typeof Command>` | - | All Command props |

### `<MicSelectorList />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `(devices: MediaDeviceInfo[]) => ReactNode` | - | Render prop for devices |

### `<MicSelectorLabel />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `device` | `MediaDeviceInfo` | - | Device info object (required) |

## Hook: useAudioDevices

```tsx
const {
  devices,      // MediaDeviceInfo[]
  loading,      // boolean
  error,        // string | null
  hasPermission, // boolean
  loadDevices,  // () => Promise<void> - Request permission
} = useAudioDevices();
```

## Permissions

The component handles permissions automatically:
- Initially loads devices without permission (may show generic labels)
- When opened, requests microphone permission if not granted
- After permission, reloads with full device labels
- Listens for device changes and updates the list

## Examples

See `scripts/` folder for complete working examples.
