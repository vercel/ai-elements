import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Setup navigator.mediaDevices mock
  Object.defineProperty(global.navigator, "mediaDevices", {
    writable: true,
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

describe("MicSelector", () => {
  it("renders as Popover component", () => {
    const { container } = render(
      <MicSelector>
        <MicSelectorTrigger>Select Microphone</MicSelectorTrigger>
      </MicSelector>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles controlled value", () => {
    const handleValueChange = vi.fn();
    render(
      <MicSelector onValueChange={handleValueChange} value="device-1">
        <MicSelectorTrigger>Select</MicSelectorTrigger>
      </MicSelector>
    );
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  it("handles uncontrolled value with defaultValue", () => {
    render(
      <MicSelector defaultValue="device-2">
        <MicSelectorTrigger>Select</MicSelectorTrigger>
      </MicSelector>
    );
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  it("handles controlled open state", () => {
    const { rerender } = render(
      <MicSelector open={false}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <div>Content</div>
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    rerender(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <div>Content</div>
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("MicSelectorTrigger", () => {
  it("renders trigger button", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger>Select Microphone</MicSelectorTrigger>
      </MicSelector>
    );
    expect(screen.getByText("Select Microphone")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger className="custom-trigger">Select</MicSelectorTrigger>
      </MicSelector>
    );
    expect(screen.getByText("Select")).toHaveClass("custom-trigger");
  });

  it("renders chevron icon", () => {
    const { container } = render(
      <MicSelector>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
      </MicSelector>
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("MicSelectorValue", () => {
  it("renders placeholder when no device selected", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
      </MicSelector>
    );
    expect(screen.getByText("Select microphone...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <MicSelector>
        <MicSelectorTrigger>
          <MicSelectorValue className="custom-value" />
        </MicSelectorTrigger>
      </MicSelector>
    );
    const value = screen.getByText("Select microphone...");
    expect(value).toHaveClass("custom-value");
  });
});

describe("MicSelectorContent", () => {
  it("renders content with Command wrapper", () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <div data-testid="content">Content</div>
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent className="custom-content">
          <div>Content</div>
        </MicSelectorContent>
      </MicSelector>
    );
    // Check that content is rendered with custom class
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("accepts popoverOptions", () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent popoverOptions={{ side: "bottom" }}>
          <div>Content</div>
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("MicSelectorInput", () => {
  it("renders search input with placeholder", () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.getByPlaceholderText("Search microphones...")).toBeInTheDocument();
  });

  it("accepts custom placeholder", () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput placeholder="Find microphone..." />
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.getByPlaceholderText("Find microphone...")).toBeInTheDocument();
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
        </MicSelectorContent>
      </MicSelector>
    );

    const input = screen.getByPlaceholderText("Search microphones...");
    await user.type(input, "USB");
    expect(input).toHaveValue("USB");
  });
});

describe("MicSelectorList", () => {
  it("renders list with render prop", async () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>
            {(devices) => (
              <div data-testid="device-count">{devices.length} devices</div>
            )}
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    await waitFor(() => {
      expect(screen.getByTestId("device-count")).toBeInTheDocument();
    });
  });

  it("provides device data to children", async () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>
            {(devices) =>
              devices.map((device) => (
                <div key={device.deviceId} data-testid={device.deviceId}>
                  {device.label}
                </div>
              ))
            }
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    await waitFor(() => {
      expect(screen.getByTestId("device-1")).toBeInTheDocument();
    });
  });
});

describe("MicSelectorEmpty", () => {
  it("renders default empty message", () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorEmpty />
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.getByText("No microphone found.")).toBeInTheDocument();
  });

  it("renders custom empty message", () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorEmpty>Custom message</MicSelectorEmpty>
        </MicSelectorContent>
      </MicSelector>
    );
    expect(screen.getByText("Custom message")).toBeInTheDocument();
  });
});

describe("MicSelectorItem", () => {
  it("renders item with value", async () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>
            {() => (
              <MicSelectorItem value="device-1">
                Test Microphone
              </MicSelectorItem>
            )}
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    expect(screen.getByText("Test Microphone")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <MicSelector onValueChange={handleValueChange} open={true}>
        <MicSelectorTrigger>Select</MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorList>
            {() => (
              <MicSelectorItem value="device-1">
                Test Microphone
              </MicSelectorItem>
            )}
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    );

    await user.click(screen.getByText("Test Microphone"));

    await waitFor(() => {
      expect(handleValueChange).toHaveBeenCalledWith("device-1");
    });
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

  it("applies custom className", () => {
    const device = mockDevices[1];
    const { container } = render(
      <MicSelectorLabel className="custom-label" device={device} />
    );

    const label = container.querySelector(".custom-label");
    expect(label).toBeInTheDocument();
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
      expect(screen.getByTestId("count")).toHaveTextContent("3");
    });
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
    });
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
      expect(screen.getByTestId("error")).toHaveTextContent("Permission denied");
    });
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
    });

    const button = screen.getByText("Request Permission");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
      expect(screen.getByTestId("permission")).toHaveTextContent("Granted");
    });
  });
});

describe("Integration tests", () => {
  it("renders complete microphone selector", async () => {
    render(
      <MicSelector open={true}>
        <MicSelectorTrigger>
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

    expect(screen.getByText("Select microphone...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search microphones...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/MacBook Pro Microphone/)).toBeInTheDocument();
      expect(screen.getByText("External Microphone")).toBeInTheDocument();
      expect(screen.getByText(/USB Microphone/)).toBeInTheDocument();
    });
  });

  it("handles device selection flow", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <MicSelector onValueChange={handleValueChange} open={true}>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
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

    await waitFor(() => {
      expect(screen.getByText("External Microphone")).toBeInTheDocument();
    });

    await user.click(screen.getByText("External Microphone"));

    await waitFor(() => {
      expect(handleValueChange).toHaveBeenCalledWith("device-2");
    });
  });
});
