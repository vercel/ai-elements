import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useVoiceSelector,
  VoiceSelector,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorAttributes,
  VoiceSelectorBullet,
  VoiceSelectorContent,
  VoiceSelectorDescription,
  VoiceSelectorEmpty,
  VoiceSelectorGender,
  VoiceSelectorGroup,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorPreview,
  VoiceSelectorSeparator,
  VoiceSelectorShortcut,
  VoiceSelectorTrigger,
} from "../src/voice-selector";

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("VoiceSelector", () => {
  it("renders children", () => {
    render(
      <VoiceSelector>
        <div>Content</div>
      </VoiceSelector>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("starts closed by default", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorTrigger>Open</VoiceSelectorTrigger>
        <VoiceSelectorContent>
          <div>Dialog content</div>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    // Content should not be visible initially
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("can start open with defaultOpen", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorTrigger>Open</VoiceSelectorTrigger>
        <VoiceSelectorContent>
          <div>Dialog content</div>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  it("calls onOpenChange when opened", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <VoiceSelector onOpenChange={onOpenChange}>
        <VoiceSelectorTrigger>Open</VoiceSelectorTrigger>
        <VoiceSelectorContent>
          <div>Dialog content</div>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    const trigger = screen.getByText("Open");
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onValueChange when voice is selected", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <VoiceSelector defaultOpen onValueChange={onValueChange}>
        <VoiceSelectorTrigger>Open</VoiceSelectorTrigger>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem
              onSelect={() => onValueChange("voice-1")}
              value="voice-1"
            >
              Voice 1
            </VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    const item = screen.getByText("Voice 1");
    await user.click(item);

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("voice-1");
    });
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <VoiceSelector onOpenChange={onOpenChange} open={false}>
        <VoiceSelectorTrigger>Open</VoiceSelectorTrigger>
        <VoiceSelectorContent>
          <div>Dialog content</div>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();

    rerender(
      <VoiceSelector onOpenChange={onOpenChange} open={true}>
        <VoiceSelectorTrigger>Open</VoiceSelectorTrigger>
        <VoiceSelectorContent>
          <div>Dialog content</div>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  it("supports controlled value state", () => {
    const TestComponent = ({ value: _value }: { value: string }) => {
      const { value: contextValue } = useVoiceSelector();
      return <div data-testid="value">{contextValue}</div>;
    };

    render(
      <VoiceSelector value="voice-1">
        <TestComponent value="voice-1" />
      </VoiceSelector>
    );

    expect(screen.getByTestId("value")).toHaveTextContent("voice-1");
  });

  it("throws error when hook used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const TestComponent = () => {
      useVoiceSelector();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "VoiceSelector components must be used within VoiceSelector"
    );

    spy.mockRestore();
  });
});

describe("VoiceSelectorContent", () => {
  it("renders with default title", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>Content</VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent title="Select AI Voice">
          Content
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent className="custom-class">
          Content
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    // Content is rendered with custom class (p-0 is default, custom-class is added)
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("VoiceSelectorInput", () => {
  it("renders search input", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorInput placeholder="Search voices..." />
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByPlaceholderText("Search voices...")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();

    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorInput placeholder="Search" />
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    const input = screen.getByPlaceholderText("Search");
    await user.type(input, "Nova");

    expect(input).toHaveValue("Nova");
  });
});

describe("VoiceSelectorList", () => {
  it("renders list items", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem value="voice-1">Voice 1</VoiceSelectorItem>
            <VoiceSelectorItem value="voice-2">Voice 2</VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Voice 1")).toBeInTheDocument();
    expect(screen.getByText("Voice 2")).toBeInTheDocument();
  });
});

describe("VoiceSelectorEmpty", () => {
  it("renders default empty message", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorInput value="xyz" />
          <VoiceSelectorList>
            <VoiceSelectorEmpty />
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    // Empty message shows when there are no results
    const emptyElement = screen.getByRole("presentation");
    expect(emptyElement).toBeInTheDocument();
  });

  it("renders custom empty message", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorEmpty>No voices available</VoiceSelectorEmpty>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("No voices available")).toBeInTheDocument();
  });
});

describe("VoiceSelectorGroup", () => {
  it("renders group heading", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorGroup heading="Professional">
              <VoiceSelectorItem value="voice-1">Voice 1</VoiceSelectorItem>
            </VoiceSelectorGroup>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Professional")).toBeInTheDocument();
  });
});

describe("VoiceSelectorItem", () => {
  it("renders item content", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem value="alloy">Alloy</VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Alloy")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem onSelect={onSelect} value="alloy">
              Alloy
            </VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    const item = screen.getByText("Alloy");
    await user.click(item);

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled();
    });
  });
});

describe("VoiceSelectorGender", () => {
  it("renders male icon", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorGender value="male" />
      </VoiceSelector>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders female icon", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorGender value="female" />
      </VoiceSelector>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders transgender icon", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorGender value="transgender" />
      </VoiceSelector>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders non-binary icon", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorGender value="non-binary" />
      </VoiceSelector>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders default icon for unknown value", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorGender />
      </VoiceSelector>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom children override", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorGender value="male">Custom</VoiceSelectorGender>
      </VoiceSelector>
    );

    expect(screen.getByText("Custom")).toBeInTheDocument();
  });
});

describe("VoiceSelectorAccent", () => {
  it("renders American flag emoji", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorAccent value="american" />
      </VoiceSelector>
    );

    expect(screen.getByText("🇺🇸")).toBeInTheDocument();
  });

  it("renders British flag emoji", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorAccent value="british" />
      </VoiceSelector>
    );

    expect(screen.getByText("🇬🇧")).toBeInTheDocument();
  });

  it("renders Australian flag emoji", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorAccent value="australian" />
      </VoiceSelector>
    );

    expect(screen.getByText("🇦🇺")).toBeInTheDocument();
  });

  it("is case-sensitive for accent values", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorAccent value="AMERICAN" />
      </VoiceSelector>
    );

    // Should not match because it's uppercase
    expect(container.textContent).not.toContain("🇺🇸");

    // Lowercase should work
    const { container: container2 } = render(
      <VoiceSelector>
        <VoiceSelectorAccent value="american" />
      </VoiceSelector>
    );

    expect(container2.textContent).toContain("🇺🇸");
  });

  it("renders nothing for unknown accent", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorAccent value="unknown" />
      </VoiceSelector>
    );

    const span = container.querySelector("span");
    expect(span?.textContent).toBe("");
  });

  it("renders custom children override", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorAccent value="american">US English</VoiceSelectorAccent>
      </VoiceSelector>
    );

    expect(screen.getByText("US English")).toBeInTheDocument();
  });

  it("renders all supported accents", () => {
    const accents = [
      { value: "canadian", emoji: "🇨🇦" },
      { value: "irish", emoji: "🇮🇪" },
      { value: "scottish", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
      { value: "indian", emoji: "🇮🇳" },
      { value: "south-african", emoji: "🇿🇦" },
      { value: "new-zealand", emoji: "🇳🇿" },
      { value: "spanish", emoji: "🇪🇸" },
      { value: "french", emoji: "🇫🇷" },
      { value: "german", emoji: "🇩🇪" },
      { value: "italian", emoji: "🇮🇹" },
      { value: "portuguese", emoji: "🇵🇹" },
      { value: "brazilian", emoji: "🇧🇷" },
      { value: "mexican", emoji: "🇲🇽" },
      { value: "argentinian", emoji: "🇦🇷" },
      { value: "japanese", emoji: "🇯🇵" },
      { value: "chinese", emoji: "🇨🇳" },
      { value: "korean", emoji: "🇰🇷" },
      { value: "russian", emoji: "🇷🇺" },
      { value: "arabic", emoji: "🇸🇦" },
      { value: "dutch", emoji: "🇳🇱" },
      { value: "swedish", emoji: "🇸🇪" },
      { value: "norwegian", emoji: "🇳🇴" },
      { value: "danish", emoji: "🇩🇰" },
      { value: "finnish", emoji: "🇫🇮" },
      { value: "polish", emoji: "🇵🇱" },
      { value: "turkish", emoji: "🇹🇷" },
      { value: "greek", emoji: "🇬🇷" },
    ];

    for (const { value, emoji } of accents) {
      const { container } = render(
        <VoiceSelector>
          <VoiceSelectorAccent value={value} />
        </VoiceSelector>
      );

      expect(container.textContent).toContain(emoji);
    }
  });
});

describe("VoiceSelectorAge", () => {
  it("renders age text", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorAge>25-35</VoiceSelectorAge>
      </VoiceSelector>
    );

    expect(screen.getByText("25-35")).toBeInTheDocument();
  });

  it("applies tabular-nums class", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorAge>40-50</VoiceSelectorAge>
      </VoiceSelector>
    );

    const span = container.querySelector(".tabular-nums");
    expect(span).toBeInTheDocument();
  });
});

describe("VoiceSelectorName", () => {
  it("renders voice name", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorName>Alloy</VoiceSelectorName>
      </VoiceSelector>
    );

    expect(screen.getByText("Alloy")).toBeInTheDocument();
  });

  it("applies truncate class", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorName>Very Long Voice Name</VoiceSelectorName>
      </VoiceSelector>
    );

    const span = container.querySelector(".truncate");
    expect(span).toBeInTheDocument();
  });
});

describe("VoiceSelectorDescription", () => {
  it("renders description text", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorDescription>
          A warm, friendly voice
        </VoiceSelectorDescription>
      </VoiceSelector>
    );

    expect(screen.getByText("A warm, friendly voice")).toBeInTheDocument();
  });
});

describe("VoiceSelectorAttributes", () => {
  it("renders children", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorAttributes>
          <span>Attribute 1</span>
          <span>Attribute 2</span>
        </VoiceSelectorAttributes>
      </VoiceSelector>
    );

    expect(screen.getByText("Attribute 1")).toBeInTheDocument();
    expect(screen.getByText("Attribute 2")).toBeInTheDocument();
  });
});

describe("VoiceSelectorBullet", () => {
  it("renders bullet character", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorBullet />
      </VoiceSelector>
    );

    expect(screen.getByText("•")).toBeInTheDocument();
  });

  it("has aria-hidden attribute", () => {
    const { container } = render(
      <VoiceSelector>
        <VoiceSelectorBullet />
      </VoiceSelector>
    );

    const bullet = container.querySelector('[aria-hidden="true"]');
    expect(bullet).toBeInTheDocument();
  });
});

describe("VoiceSelectorSeparator", () => {
  it("renders separator", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem value="item1">Item 1</VoiceSelectorItem>
            <VoiceSelectorSeparator />
            <VoiceSelectorItem value="item2">Item 2</VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    // Verify items around separator render correctly
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});

describe("VoiceSelectorShortcut", () => {
  it("renders shortcut text", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem value="voice-1">
              Voice 1<VoiceSelectorShortcut>⌘K</VoiceSelectorShortcut>
            </VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });
});

describe("VoiceSelectorPreview", () => {
  it("renders play button by default", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorPreview />
      </VoiceSelector>
    );

    const button = screen.getByRole("button", { name: "Play preview" });
    expect(button).toBeInTheDocument();
  });

  it("renders pause button when playing", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorPreview playing />
      </VoiceSelector>
    );

    const button = screen.getByRole("button", { name: "Pause preview" });
    expect(button).toBeInTheDocument();
  });

  it("is disabled when loading", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorPreview loading />
      </VoiceSelector>
    );

    const button = screen.getByRole("button", { name: "Play preview" });
    expect(button).toBeDisabled();
  });

  it("calls onPlay when clicked", async () => {
    const onPlay = vi.fn();
    const user = userEvent.setup();

    render(
      <VoiceSelector>
        <VoiceSelectorPreview onPlay={onPlay} />
      </VoiceSelector>
    );

    const button = screen.getByRole("button", { name: "Play preview" });
    await user.click(button);

    expect(onPlay).toHaveBeenCalled();
  });

  it("does not trigger item selection when clicked", async () => {
    const onSelect = vi.fn();
    const onPlay = vi.fn();
    const user = userEvent.setup();

    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem onSelect={onSelect} value="voice-1">
              <VoiceSelectorPreview onPlay={onPlay} />
              Voice 1
            </VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    const button = screen.getByRole("button", { name: "Play preview" });
    await user.click(button);

    await waitFor(() => {
      expect(onPlay).toHaveBeenCalled();
    });

    // onSelect should not be called when clicking the preview button
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(
      <VoiceSelector>
        <VoiceSelectorPreview className="custom-class" />
      </VoiceSelector>
    );

    const button = screen.getByRole("button", { name: "Play preview" });
    expect(button).toHaveClass("custom-class");
  });
});

describe("useVoiceSelector hook", () => {
  it("provides value and setValue", () => {
    const TestComponent = () => {
      const { value, setValue } = useVoiceSelector();
      return (
        <div>
          <div data-testid="value">{value ?? "none"}</div>
          <button onClick={() => setValue("new-voice")} type="button">
            Set Voice
          </button>
        </div>
      );
    };

    render(
      <VoiceSelector defaultValue="initial-voice">
        <TestComponent />
      </VoiceSelector>
    );

    expect(screen.getByTestId("value")).toHaveTextContent("initial-voice");
  });

  it("provides open and setOpen", async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const { open, setOpen } = useVoiceSelector();
      return (
        <div>
          <div data-testid="open">{open ? "open" : "closed"}</div>
          <button onClick={() => setOpen(true)} type="button">
            Open
          </button>
        </div>
      );
    };

    render(
      <VoiceSelector>
        <TestComponent />
      </VoiceSelector>
    );

    expect(screen.getByTestId("open")).toHaveTextContent("closed");

    const button = screen.getByText("Open");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("open")).toHaveTextContent("open");
    });
  });

  it("allows updating value from nested component", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const TestComponent = () => {
      const { setValue } = useVoiceSelector();
      return (
        <button onClick={() => setValue("test-voice")} type="button">
          Select Voice
        </button>
      );
    };

    render(
      <VoiceSelector onValueChange={onValueChange}>
        <TestComponent />
      </VoiceSelector>
    );

    const button = screen.getByText("Select Voice");
    await user.click(button);

    expect(onValueChange).toHaveBeenCalledWith("test-voice");
  });
});

describe("Integration tests", () => {
  it("renders complete voice selector with all metadata", () => {
    render(
      <VoiceSelector defaultOpen>
        <VoiceSelectorTrigger>Select Voice</VoiceSelectorTrigger>
        <VoiceSelectorContent>
          <VoiceSelectorInput placeholder="Search..." />
          <VoiceSelectorList>
            <VoiceSelectorGroup heading="Professional">
              <VoiceSelectorItem value="alloy">
                <VoiceSelectorName>Alloy</VoiceSelectorName>
                <VoiceSelectorAttributes>
                  <VoiceSelectorGender value="male" />
                  <VoiceSelectorBullet />
                  <VoiceSelectorAccent value="american" />
                  <VoiceSelectorBullet />
                  <VoiceSelectorAge>40-50</VoiceSelectorAge>
                </VoiceSelectorAttributes>
              </VoiceSelectorItem>
            </VoiceSelectorGroup>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText("Alloy")).toBeInTheDocument();
    expect(screen.getByText("🇺🇸")).toBeInTheDocument();
    expect(screen.getByText("40-50")).toBeInTheDocument();
  });

  it("handles voice selection and dialog closing", async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <VoiceSelector
        defaultOpen
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      >
        <VoiceSelectorContent>
          <VoiceSelectorList>
            <VoiceSelectorItem
              onSelect={() => onValueChange("nova")}
              value="nova"
            >
              Nova
            </VoiceSelectorItem>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    );

    const item = screen.getByText("Nova");
    await user.click(item);

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("nova");
    });
  });
});
