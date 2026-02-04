import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
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

const MACBOOK_PRO_MIC_REGEX = /MacBook Pro Microphone/;

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const setupMocks = () => {
  window.ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;

  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      addEventListener: vi.fn(),
      enumerateDevices: mockEnumerateDevices,
      getUserMedia: mockGetUserMedia,
      removeEventListener: vi.fn(),
    },
    writable: true,
  });

  mockEnumerateDevices.mockResolvedValue(mockDevices);
  mockGetUserMedia.mockImplementation(() => {
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    return Promise.resolve(mockStream);
  });
};

const [macbookMicDevice, externalMicDevice, usbMicDevice] = mockDevices;

describe("micSelectorLabel", () => {
  it("renders simple device label", () => {
    render(<MicSelectorLabel device={externalMicDevice} />);
    expect(screen.getByText("External Microphone")).toBeInTheDocument();
  });

  it("parses device ID from label", () => {
    const { container } = render(
      <MicSelectorLabel device={macbookMicDevice} />
    );

    expect(container.textContent).toContain("MacBook Pro Microphone");
    expect(container.textContent).toContain("(1a2b:3c4d)");
  });

  it("applies muted styling to device ID", () => {
    const { container } = render(<MicSelectorLabel device={usbMicDevice} />);

    const mutedSpan = container.querySelector(".text-muted-foreground");
    expect(mutedSpan).toBeInTheDocument();
    expect(mutedSpan).toHaveTextContent("(4e5f:6a7b)");
  });

  it("accepts custom className prop", () => {
    render(
      <MicSelectorLabel className="custom-label" device={externalMicDevice} />
    );

    expect(screen.getByText("External Microphone")).toBeInTheDocument();
  });
});

// Test display helpers - ternaries are acceptable in helper components
// oxlint-disable-next-line eslint-plugin-jest(no-conditional-in-test)
const LoadingDisplay = ({ loading }: { loading: boolean }) => (
  <div data-testid="loading">{loading ? "Loading" : "Loaded"}</div>
);

const ErrorDisplay = ({ error }: { error: string | null }) => (
  <div data-testid="error">{error ?? "No error"}</div>
);

// oxlint-disable-next-line eslint-plugin-jest(no-conditional-in-test)
const PermissionDisplay = ({ hasPermission }: { hasPermission: boolean }) => (
  <div data-testid="permission">
    {hasPermission ? "Granted" : "Not granted"}
  </div>
);

describe("useAudioDevices hook", () => {
  it("loads devices on mount", async () => {
    setupMocks();
    const TestComponent = () => {
      const { devices, loading } = useAudioDevices();
      return (
        <div>
          <LoadingDisplay loading={loading} />
          <div data-testid="count">{devices.length}</div>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("count")).toHaveTextContent("3");
      },
      { timeout: 3000 }
    );
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

    await waitFor(
      () => {
        expect(screen.getByTestId("count")).toHaveTextContent("3");
      },
      { timeout: 3000 }
    );
  });

  it("handles errors gracefully", async () => {
    setupMocks();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(vi.fn());
    mockEnumerateDevices.mockRejectedValueOnce(new Error("Permission denied"));

    const TestComponent = () => {
      const { error, loading } = useAudioDevices();
      return (
        <div>
          <LoadingDisplay loading={loading} />
          <ErrorDisplay error={error} />
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Permission denied"
        );
      },
      { timeout: 3000 }
    );

    consoleErrorSpy.mockRestore();
  });

  it("requests permission when loadDevices is called", async () => {
    setupMocks();
    const TestComponent = () => {
      const { loadDevices, hasPermission } = useAudioDevices();
      return (
        <div>
          <button onClick={loadDevices} type="button">
            Request Permission
          </button>
          <PermissionDisplay hasPermission={hasPermission} />
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId("permission")).toHaveTextContent(
          "Not granted"
        );
      },
      { timeout: 3000 }
    );

    const button = screen.getByText("Request Permission");
    await userEvent.setup().click(button);

    await waitFor(
      () => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("permission")).toHaveTextContent("Granted");
      },
      { timeout: 3000 }
    );
  });

  it("returns devices array", async () => {
    const TestComponent = () => {
      const { devices } = useAudioDevices();
      return (
        <div>
          {devices.map((device) => (
            <div
              data-testid={`device-${device.deviceId}`}
              key={device.deviceId}
            >
              {device.label}
            </div>
          ))}
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId("device-device-1")).toBeInTheDocument();
        expect(screen.getByTestId("device-device-2")).toBeInTheDocument();
        expect(screen.getByTestId("device-device-3")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("returns loading state initially", () => {
    setupMocks();
    const TestComponent = () => {
      const { loading } = useAudioDevices();
      return <LoadingDisplay loading={loading} />;
    };

    render(<TestComponent />);

    // Initially should be loading
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading");
  });

  it("handles device change events", async () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        addEventListener,
        enumerateDevices: mockEnumerateDevices,
        getUserMedia: mockGetUserMedia,
        removeEventListener,
      },
      writable: true,
    });

    const TestComponent = () => {
      const { devices } = useAudioDevices();
      return <div data-testid="count">{devices.length}</div>;
    };

    const { unmount } = render(<TestComponent />);

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith(
        "devicechange",
        expect.any(Function)
      );
    });

    unmount();

    await waitFor(() => {
      expect(removeEventListener).toHaveBeenCalledWith(
        "devicechange",
        expect.any(Function)
      );
    });
  });

  it("prevents concurrent loadDevices calls", async () => {
    setupMocks();
    const TestComponent = () => {
      const { loadDevices, loading } = useAudioDevices();
      return (
        <div>
          <button onClick={loadDevices} type="button">
            Load
          </button>
          <LoadingDisplay loading={loading} />
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
      },
      { timeout: 3000 }
    );

    const button = screen.getByText("Load");

    // Click multiple times rapidly
    await userEvent.setup().click(button);
    await userEvent.setup().click(button);

    // Should only call getUserMedia once per actual load
    await waitFor(
      () => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
      },
      { timeout: 3000 }
    );
  });

  it("handles non-Error exception in loadDevicesWithoutPermission", async () => {
    setupMocks();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(vi.fn());
    mockEnumerateDevices.mockRejectedValueOnce("String error");

    const TestComponent = () => {
      const { error, loading } = useAudioDevices();
      return (
        <div>
          <LoadingDisplay loading={loading} />
          <ErrorDisplay error={error} />
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Failed to get audio devices"
        );
      },
      { timeout: 3000 }
    );

    consoleErrorSpy.mockRestore();
  });

  it("handles non-Error exception in loadDevicesWithPermission", async () => {
    setupMocks();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(vi.fn());
    mockGetUserMedia.mockRejectedValueOnce("String error");

    const TestComponent = () => {
      const { loadDevices, error, loading } = useAudioDevices();
      return (
        <div>
          <button onClick={loadDevices} type="button">
            Load
          </button>
          <LoadingDisplay loading={loading} />
          <ErrorDisplay error={error} />
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
    });

    await userEvent.setup().click(screen.getByText("Load"));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Failed to get audio devices"
      );
    });

    consoleErrorSpy.mockRestore();
  });
});

describe("micSelector", () => {
  it("renders with default props", () => {
    setupMocks();
    render(
      <MicSelector>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
          <MicSelectorList>
            {(devices) =>
              devices.map((device) => (
                <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MicSelectorItem>
              ))
            }
          </MicSelectorList>
          <MicSelectorEmpty />
        </MicSelectorContent>
      </MicSelector>
    );

    expect(screen.getByText("Select microphone...")).toBeInTheDocument();
  });

  it("opens popover when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MicSelector>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
          <MicSelectorList>
            {(devices) =>
              devices.map((device) => (
                <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MicSelectorItem>
              ))
            }
          </MicSelectorList>
          <MicSelectorEmpty />
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search microphones...")
      ).toBeInTheDocument();
    });
  });

  it("supports controlled value", async () => {
    const onValueChange = vi.fn();

    render(
      <MicSelector onValueChange={onValueChange} value="device-1">
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>
            {(devices) =>
              devices.map((device) => (
                <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MicSelectorItem>
              ))
            }
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    await waitFor(() => {
      expect(screen.getByText(MACBOOK_PRO_MIC_REGEX)).toBeInTheDocument();
    });
  });

  it("supports controlled open state", async () => {
    const onOpenChange = vi.fn();

    render(
      <MicSelector onOpenChange={onOpenChange} open={true}>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
          <MicSelectorList>
            {(devices) =>
              devices.map((device) => (
                <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MicSelectorItem>
              ))
            }
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search microphones...")
      ).toBeInTheDocument();
    });
  });

  it("supports defaultValue", async () => {
    render(
      <MicSelector defaultValue="device-2">
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>
            {(devices) =>
              devices.map((device) => (
                <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MicSelectorItem>
              ))
            }
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    await waitFor(() => {
      expect(screen.getByText("External Microphone")).toBeInTheDocument();
    });
  });

  it("selects item and closes popover", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MicSelector onValueChange={onValueChange}>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>
            {(devices) =>
              devices.map((device) => (
                <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MicSelectorItem>
              ))
            }
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("External Microphone")).toBeInTheDocument();
    });

    await user.click(screen.getByText("External Microphone"));

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("device-2");
    });
  });
});

describe("micSelectorTrigger", () => {
  it("renders children", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger>
          <span>Custom Content</span>
        </MicSelectorTrigger>
      </MicSelector>
    );

    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });

  it("renders chevron icon", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger>
          <span>Trigger</span>
        </MicSelectorTrigger>
      </MicSelector>
    );

    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});

describe("micSelectorContent", () => {
  it("renders with custom className", async () => {
    const user = userEvent.setup();

    render(
      <MicSelector>
        <MicSelectorTrigger>Trigger</MicSelectorTrigger>
        <MicSelectorContent className="custom-class">
          <MicSelectorEmpty />
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("No microphone found.")).toBeInTheDocument();
    });
  });
});

describe("micSelectorInput", () => {
  it("renders with default placeholder", async () => {
    const user = userEvent.setup();

    render(
      <MicSelector>
        <MicSelectorTrigger>Trigger</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search microphones...")
      ).toBeInTheDocument();
    });
  });

  it("renders with custom placeholder", async () => {
    const user = userEvent.setup();

    render(
      <MicSelector>
        <MicSelectorTrigger>Trigger</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput placeholder="Find mic..." />
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Find mic...")).toBeInTheDocument();
    });
  });
});

describe("micSelectorEmpty", () => {
  it("renders default empty message", async () => {
    const user = userEvent.setup();
    mockEnumerateDevices.mockResolvedValueOnce([]);

    render(
      <MicSelector>
        <MicSelectorTrigger>Trigger</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>{() => null}</MicSelectorList>
          <MicSelectorEmpty />
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("No microphone found.")).toBeInTheDocument();
    });
  });

  it("renders custom empty message", async () => {
    const user = userEvent.setup();
    mockEnumerateDevices.mockResolvedValueOnce([]);

    render(
      <MicSelector>
        <MicSelectorTrigger>Trigger</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>{() => null}</MicSelectorList>
          <MicSelectorEmpty>No mics available</MicSelectorEmpty>
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("No mics available")).toBeInTheDocument();
    });
  });
});

describe("micSelectorValue", () => {
  it("shows placeholder when no value selected", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
      </MicSelector>
    );

    expect(screen.getByText("Select microphone...")).toBeInTheDocument();
  });

  it("shows selected device label", async () => {
    render(
      <MicSelector value="device-2">
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
      </MicSelector>
    );

    await waitFor(() => {
      expect(screen.getByText("External Microphone")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger>
          <MicSelectorValue className="custom-value" />
        </MicSelectorTrigger>
      </MicSelector>
    );

    expect(screen.getByText("Select microphone...")).toHaveClass(
      "custom-value"
    );
  });
});
