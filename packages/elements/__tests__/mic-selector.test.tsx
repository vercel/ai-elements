import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MicSelectorLabel,
  useAudioDevices,
} from "../src/mic-selector";

// Mock navigator.mediaDevices
const mockDevices: MediaDeviceInfo[] = [
  {
    deviceId: "device-1",
    groupId: "group-1",
    kind: "audioinput",
    label: "MacBook Pro Microphone (1a2b:3c4d)",
    toJSON: () => ({}),
  } as MediaDeviceInfo,
  {
    deviceId: "device-2",
    groupId: "group-2",
    kind: "audioinput",
    label: "External Microphone",
    toJSON: () => ({}),
  } as MediaDeviceInfo,
  {
    deviceId: "device-3",
    groupId: "group-3",
    kind: "audioinput",
    label: "USB Microphone (4e5f:6a7b)",
    toJSON: () => ({}),
  } as MediaDeviceInfo,
];

const mockEnumerateDevices = vi.fn();
const mockGetUserMedia = vi.fn();

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});

  // Mock ResizeObserver
  (window as any).ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Setup navigator.mediaDevices mock
  Object.defineProperty(navigator, "mediaDevices", {
    writable: true,
    configurable: true,
    value: {
      enumerateDevices: mockEnumerateDevices,
      getUserMedia: mockGetUserMedia,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });

  mockEnumerateDevices.mockResolvedValue(mockDevices);
  mockGetUserMedia.mockImplementation(() => {
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    return Promise.resolve(mockStream);
  });
});

describe("MicSelectorLabel", () => {
  it("renders simple device label", () => {
    const device = mockDevices[1]; // External Microphone
    render(<MicSelectorLabel device={device} />);
    expect(screen.getByText("External Microphone")).toBeInTheDocument();
  });

  it("parses device ID from label", () => {
    const device = mockDevices[0]; // MacBook Pro Microphone (1a2b:3c4d)
    const { container } = render(<MicSelectorLabel device={device} />);

    expect(container.textContent).toContain("MacBook Pro Microphone");
    expect(container.textContent).toContain("(1a2b:3c4d)");
  });

  it("applies muted styling to device ID", () => {
    const device = mockDevices[2]; // USB Microphone (4e5f:6a7b)
    const { container } = render(<MicSelectorLabel device={device} />);

    const mutedSpan = container.querySelector(".text-muted-foreground");
    expect(mutedSpan).toBeInTheDocument();
    expect(mutedSpan).toHaveTextContent("(4e5f:6a7b)");
  });

  it("accepts custom className prop", () => {
    const device = mockDevices[1];
    render(
      <MicSelectorLabel className="custom-label" device={device} />
    );

    // Verify component renders
    expect(screen.getByText("External Microphone")).toBeInTheDocument();
  });
});

describe("useAudioDevices hook", () => {
  it("loads devices on mount", async () => {
    const TestComponent = () => {
      const { devices, loading } = useAudioDevices();
      return (
        <div>
          <div data-testid="loading">{loading ? "Loading" : "Loaded"}</div>
          <div data-testid="count">{devices.length}</div>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("3");
    }, { timeout: 3000 });
  });

  it("filters only audio input devices", async () => {
    const mixedDevices: MediaDeviceInfo[] = [
      ...mockDevices,
      {
        deviceId: "video-1",
        groupId: "group-4",
        kind: "videoinput",
        label: "Camera",
        toJSON: () => ({}),
      } as MediaDeviceInfo,
    ];

    mockEnumerateDevices.mockResolvedValueOnce(mixedDevices);

    const TestComponent = () => {
      const { devices } = useAudioDevices();
      return <div data-testid="count">{devices.length}</div>;
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("3");
    }, { timeout: 3000 });
  });

  it("handles errors gracefully", async () => {
    mockEnumerateDevices.mockRejectedValueOnce(new Error("Permission denied"));

    const TestComponent = () => {
      const { error, loading } = useAudioDevices();
      return (
        <div>
          <div data-testid="loading">{loading ? "Loading" : "Loaded"}</div>
          <div data-testid="error">{error || "No error"}</div>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Permission denied");
    }, { timeout: 3000 });
  });

  it("requests permission when loadDevices is called", async () => {
    const TestComponent = () => {
      const { loadDevices, hasPermission } = useAudioDevices();
      return (
        <div>
          <button onClick={loadDevices} type="button">Request Permission</button>
          <div data-testid="permission">
            {hasPermission ? "Granted" : "Not granted"}
          </div>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("permission")).toHaveTextContent("Not granted");
    }, { timeout: 3000 });

    const button = screen.getByText("Request Permission");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByTestId("permission")).toHaveTextContent("Granted");
    }, { timeout: 3000 });
  });

  it("returns devices array", async () => {
    const TestComponent = () => {
      const { devices } = useAudioDevices();
      return (
        <div>
          {devices.map((device) => (
            <div key={device.deviceId} data-testid={`device-${device.deviceId}`}>
              {device.label}
            </div>
          ))}
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("device-device-1")).toBeInTheDocument();
      expect(screen.getByTestId("device-device-2")).toBeInTheDocument();
      expect(screen.getByTestId("device-device-3")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("returns loading state initially", () => {
    const TestComponent = () => {
      const { loading } = useAudioDevices();
      return <div data-testid="loading">{loading ? "Loading" : "Loaded"}</div>;
    };

    render(<TestComponent />);

    // Initially should be loading
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading");
  });

  it("handles device change events", async () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      configurable: true,
      value: {
        enumerateDevices: mockEnumerateDevices,
        getUserMedia: mockGetUserMedia,
        addEventListener,
        removeEventListener,
      },
    });

    const TestComponent = () => {
      const { devices } = useAudioDevices();
      return <div data-testid="count">{devices.length}</div>;
    };

    const { unmount } = render(<TestComponent />);

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith("devicechange", expect.any(Function));
    });

    unmount();

    await waitFor(() => {
      expect(removeEventListener).toHaveBeenCalledWith("devicechange", expect.any(Function));
    });
  });

  it("prevents concurrent loadDevices calls", async () => {
    const TestComponent = () => {
      const { loadDevices, loading } = useAudioDevices();
      return (
        <div>
          <button onClick={loadDevices} type="button">Load</button>
          <div data-testid="loading">{loading ? "Loading" : "Loaded"}</div>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
    }, { timeout: 3000 });

    const button = screen.getByText("Load");

    // Click multiple times rapidly
    await userEvent.setup().click(button);
    await userEvent.setup().click(button);

    // Should only call getUserMedia once per actual load
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
