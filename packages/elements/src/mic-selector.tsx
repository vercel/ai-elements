"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/shadcn-ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/ui/popover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const deviceIdRegex = /\(([\da-fA-F]{4}:[\da-fA-F]{4})\)$/;

type MicSelectorContextType = {
  data: MediaDeviceInfo[];
  value: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  width: number;
  setWidth?: (width: number) => void;
};

const MicSelectorContext = createContext<MicSelectorContextType>({
  data: [],
  value: "",
  onValueChange: undefined,
  open: false,
  onOpenChange: undefined,
  width: 200,
  setWidth: undefined,
});

export type MicSelectorProps = ComponentProps<typeof Popover> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const MicSelector = ({
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: MicSelectorProps) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? "",
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });
  const [open, onOpenChange] = useControllableState({
    defaultProp: defaultOpen,
    prop: controlledOpen,
    onChange: controlledOnOpenChange,
  });
  const [width, setWidth] = useState(200);
  const { devices, loading, hasPermission, loadDevices } = useAudioDevices();

  const handleOpenChange = async (newOpen: boolean) => {
    if (open && !hasPermission && !loading) {
      await loadDevices();
    }
    onOpenChange(newOpen);
  };

  return (
    <MicSelectorContext.Provider
      value={{
        data: devices,
        value,
        onValueChange,
        open,
        onOpenChange: handleOpenChange,
        width,
        setWidth,
      }}
    >
      <Popover {...props} onOpenChange={onOpenChange} open={open} />
    </MicSelectorContext.Provider>
  );
};

export type MicSelectorTriggerProps = ComponentProps<typeof Button>;

export const MicSelectorTrigger = ({
  children,
  ...props
}: MicSelectorTriggerProps) => {
  const { setWidth } = useContext(MicSelectorContext);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Create a ResizeObserver to detect width changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = (entry.target as HTMLElement).offsetWidth;
        if (newWidth) {
          setWidth?.(newWidth);
        }
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Clean up the observer when component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, [setWidth]);

  return (
    <PopoverTrigger asChild>
      <Button variant="outline" {...props} ref={ref}>
        {children}
        <ChevronsUpDownIcon
          className="shrink-0 text-muted-foreground"
          size={16}
        />
      </Button>
    </PopoverTrigger>
  );
};

export type MicSelectorContentProps = ComponentProps<typeof Command> & {
  popoverOptions?: ComponentProps<typeof PopoverContent>;
};

export const MicSelectorContent = ({
  className,
  popoverOptions,
  ...props
}: MicSelectorContentProps) => {
  const { width } = useContext(MicSelectorContext);

  return (
    <PopoverContent
      className={cn("p-0", className)}
      style={{ width }}
      {...popoverOptions}
    >
      <Command {...props} />
    </PopoverContent>
  );
};

export type MicSelectorInputProps = ComponentProps<typeof CommandInput> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export const MicSelectorInput = ({ ...props }: MicSelectorInputProps) => (
  <CommandInput placeholder="Search microphones..." {...props} />
);

export type MicSelectorListProps = Omit<
  ComponentProps<typeof CommandList>,
  "children"
> & {
  children: (devices: MediaDeviceInfo[]) => ReactNode;
};

export const MicSelectorList = ({
  children,
  ...props
}: MicSelectorListProps) => {
  const { data } = useContext(MicSelectorContext);

  return <CommandList {...props}>{children(data)}</CommandList>;
};

export type MicSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const MicSelectorEmpty = ({
  children = "No microphone found.",
  ...props
}: MicSelectorEmptyProps) => <CommandEmpty {...props}>{children}</CommandEmpty>;

export type MicSelectorItemProps = ComponentProps<typeof CommandItem>;

export const MicSelectorItem = (props: MicSelectorItemProps) => {
  const { onValueChange, onOpenChange } = useContext(MicSelectorContext);

  return (
    <CommandItem
      onSelect={(currentValue) => {
        onValueChange?.(currentValue);
        onOpenChange?.(false);
      }}
      {...props}
    />
  );
};

export type MicSelectorLabelProps = ComponentProps<"span"> & {
  device: MediaDeviceInfo;
};

export const MicSelectorLabel = ({
  device,
  className,
  ...props
}: MicSelectorLabelProps) => {
  const matches = device.label.match(deviceIdRegex);

  console.log(matches, device.label);

  if (!matches) {
    return (
      <span className={className} {...props}>
        {device.label}
      </span>
    );
  }

  const [, deviceId] = matches;
  const name = device.label.replace(deviceIdRegex, "");

  return (
    <span className={className} {...props}>
      <span>{name}</span>
      <span className="text-muted-foreground"> ({deviceId})</span>
    </span>
  );
};

export type MicSelectorValueProps = ComponentProps<"span">;

export const MicSelectorValue = ({
  className,
  ...props
}: MicSelectorValueProps) => {
  const { data, value } = useContext(MicSelectorContext);
  const currentDevice = data.find((d) => d.deviceId === value);

  if (!currentDevice) {
    return (
      <span className={cn("flex-1 text-left", className)} {...props}>
        Select microphone...
      </span>
    );
  }

  return (
    <MicSelectorLabel
      className={cn("flex-1 text-left", className)}
      device={currentDevice}
      {...props}
    />
  );
};

export const useAudioDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const loadDevicesWithoutPermission = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter(
        (device) => device.kind === "audioinput"
      );

      setDevices(audioInputs);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get audio devices";

      setError(message);
      console.error("Error getting audio devices:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDevicesWithPermission = useCallback(async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      for (const track of tempStream.getTracks()) {
        track.stop();
      }

      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter(
        (device) => device.kind === "audioinput"
      );

      setDevices(audioInputs);
      setHasPermission(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get audio devices";

      setError(message);
      console.error("Error getting audio devices:", message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadDevicesWithoutPermission();
  }, [loadDevicesWithoutPermission]);

  useEffect(() => {
    const handleDeviceChange = () => {
      if (hasPermission) {
        loadDevicesWithPermission();
      } else {
        loadDevicesWithoutPermission();
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [hasPermission, loadDevicesWithPermission, loadDevicesWithoutPermission]);

  return {
    devices,
    loading,
    error,
    hasPermission,
    loadDevices: loadDevicesWithPermission,
  };
};
