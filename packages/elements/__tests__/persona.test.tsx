import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Persona } from "../src/persona";

// Mock the Rive hooks and components
const mockUseRive = vi.fn();
const mockUseStateMachineInput = vi.fn();
const mockUseViewModel = vi.fn();
const mockUseViewModelInstance = vi.fn();
const mockUseViewModelInstanceColor = vi.fn();
const MockRiveComponent = vi.fn(() => <div data-testid="rive-component" />);

vi.mock("@rive-app/react-webgl2", () => ({
  useRive: (params: any) => mockUseRive(params),
  useStateMachineInput: (rive: any, stateMachine: string, input: string) =>
    mockUseStateMachineInput(rive, stateMachine, input),
  useViewModel: (rive: any, options: any) => mockUseViewModel(rive, options),
  useViewModelInstance: (viewModel: any, options: any) =>
    mockUseViewModelInstance(viewModel, options),
  useViewModelInstanceColor: (name: string, instance: any) =>
    mockUseViewModelInstanceColor(name, instance),
}));

// Mock console methods
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  // Reset mocks
  mockUseRive.mockReset();
  mockUseStateMachineInput.mockReset();
  mockUseViewModel.mockReset();
  mockUseViewModelInstance.mockReset();
  mockUseViewModelInstanceColor.mockReset();
  MockRiveComponent.mockClear();

  // Default mock implementations
  mockUseRive.mockReturnValue({
    rive: {},
    RiveComponent: MockRiveComponent,
  });

  mockUseStateMachineInput.mockReturnValue({
    value: false,
  });

  mockUseViewModel.mockReturnValue({});
  mockUseViewModelInstance.mockReturnValue({});
  mockUseViewModelInstanceColor.mockReturnValue({ setRgb: vi.fn() });
});

describe("Persona", () => {
  it("renders the Rive component", () => {
    const { getByTestId } = render(<Persona state="idle" />);
    expect(getByTestId("rive-component")).toBeInTheDocument();
  });

  it("uses default variant 'obsidian' when not specified", () => {
    render(<Persona state="idle" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/obsidian-2.0.riv",
        stateMachines: "default",
        autoplay: true,
      })
    );
  });

  it("renders with obsidian variant", () => {
    render(<Persona state="idle" variant="obsidian" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/obsidian-2.0.riv",
      })
    );
  });

  it("renders with mana variant", () => {
    render(<Persona state="idle" variant="mana" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/mana-2.0.riv",
      })
    );
  });

  it("renders with opal variant", () => {
    render(<Persona state="idle" variant="opal" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/orb-1.2.riv",
      })
    );
  });

  it("renders with halo variant", () => {
    render(<Persona state="idle" variant="halo" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/halo-2.0.riv",
      })
    );
  });

  it("renders with glint variant", () => {
    render(<Persona state="idle" variant="glint" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/glint-2.0.riv",
      })
    );
  });

  it("renders with command variant", () => {
    render(<Persona state="idle" variant="command" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/command-2.0.riv",
      })
    );
  });

  it("applies custom className", () => {
    MockRiveComponent.mockImplementation(({ className }) => (
      <div className={className} data-testid="rive-component" />
    ));

    const { getByTestId } = render(
      <Persona className="custom-class" state="idle" />
    );

    const component = getByTestId("rive-component");
    expect(component).toHaveClass("custom-class");
  });

  it("applies default size classes", () => {
    MockRiveComponent.mockImplementation(({ className }) => (
      <div className={className} data-testid="rive-component" />
    ));

    const { getByTestId } = render(<Persona state="idle" />);

    const component = getByTestId("rive-component");
    expect(component.className).toContain("size-16");
    expect(component.className).toContain("shrink-0");
  });

  it("merges custom className with default classes", () => {
    MockRiveComponent.mockImplementation(({ className }) => (
      <div className={className} data-testid="rive-component" />
    ));

    const { getByTestId } = render(
      <Persona className="size-32" state="idle" />
    );

    const component = getByTestId("rive-component");
    expect(component.className).toContain("size-32");
    expect(component.className).toContain("shrink-0");
  });

  it("initializes state machine inputs for listening, thinking, and speaking", () => {
    const mockRive = { id: "test-rive" };
    mockUseRive.mockReturnValue({
      rive: mockRive,
      RiveComponent: MockRiveComponent,
    });

    render(<Persona state="idle" />);

    expect(mockUseStateMachineInput).toHaveBeenCalledWith(
      mockRive,
      "default",
      "listening"
    );
    expect(mockUseStateMachineInput).toHaveBeenCalledWith(
      mockRive,
      "default",
      "thinking"
    );
    expect(mockUseStateMachineInput).toHaveBeenCalledWith(
      mockRive,
      "default",
      "speaking"
    );
  });
});

describe("Persona - State Management", () => {
  it("sets listening input to true when state is listening", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      return { value: false };
    });

    render(<Persona state="listening" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(true);
      expect(mockThinkingInput.value).toBe(false);
      expect(mockSpeakingInput.value).toBe(false);
    });
  });

  it("sets thinking input to true when state is thinking", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      return { value: false };
    });

    render(<Persona state="thinking" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(false);
      expect(mockThinkingInput.value).toBe(true);
      expect(mockSpeakingInput.value).toBe(false);
    });
  });

  it("sets speaking input to true when state is speaking", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      return { value: false };
    });

    render(<Persona state="speaking" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(false);
      expect(mockThinkingInput.value).toBe(false);
      expect(mockSpeakingInput.value).toBe(true);
    });
  });

  it("sets all inputs to false when state is idle", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      return { value: false };
    });

    render(<Persona state="idle" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(false);
      expect(mockThinkingInput.value).toBe(false);
      expect(mockSpeakingInput.value).toBe(false);
    });
  });

  it("sets all inputs to false when state is asleep", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      return { value: false };
    });

    render(<Persona state="asleep" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(false);
      expect(mockThinkingInput.value).toBe(false);
      expect(mockSpeakingInput.value).toBe(false);
    });
  });

  it("updates state inputs when state prop changes", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      return { value: false };
    });

    const { rerender } = render(<Persona state="idle" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(false);
    });

    rerender(<Persona state="listening" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(true);
    });

    rerender(<Persona state="thinking" />);

    await waitFor(() => {
      expect(mockListeningInput.value).toBe(false);
      expect(mockThinkingInput.value).toBe(true);
    });
  });

  it("handles null state machine inputs gracefully", () => {
    mockUseStateMachineInput.mockReturnValue(null);

    // Should not throw an error
    expect(() => {
      render(<Persona state="listening" />);
    }).not.toThrow();
  });
});

describe("Persona - Lifecycle Callbacks", () => {
  it("passes onLoad to useRive when provided", () => {
    const onLoad = vi.fn();
    render(<Persona onLoad={onLoad} state="idle" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onLoad: expect.any(Function),
      })
    );
  });

  it("passes onLoadError to useRive when provided", () => {
    const onLoadError = vi.fn();
    render(<Persona onLoadError={onLoadError} state="idle" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onLoadError: expect.any(Function),
      })
    );
  });

  it("passes onReady as onRiveReady to useRive when provided", () => {
    const onReady = vi.fn();
    render(<Persona onReady={onReady} state="idle" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onRiveReady: expect.any(Function),
      })
    );
  });

  it("passes onPause to useRive when provided", () => {
    const onPause = vi.fn();
    render(<Persona onPause={onPause} state="idle" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onPause: expect.any(Function),
      })
    );
  });

  it("passes onPlay to useRive when provided", () => {
    const onPlay = vi.fn();
    render(<Persona onPlay={onPlay} state="idle" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onPlay: expect.any(Function),
      })
    );
  });

  it("passes onStop to useRive when provided", () => {
    const onStop = vi.fn();
    render(<Persona onStop={onStop} state="idle" />);

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onStop: expect.any(Function),
      })
    );
  });

  it("passes all lifecycle callbacks to useRive simultaneously", () => {
    const callbacks = {
      onLoad: vi.fn(),
      onLoadError: vi.fn(),
      onReady: vi.fn(),
      onPause: vi.fn(),
      onPlay: vi.fn(),
      onStop: vi.fn(),
    };

    render(
      <Persona
        onLoad={callbacks.onLoad}
        onLoadError={callbacks.onLoadError}
        onPause={callbacks.onPause}
        onPlay={callbacks.onPlay}
        onReady={callbacks.onReady}
        onStop={callbacks.onStop}
        state="idle"
      />
    );

    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onLoad: expect.any(Function),
        onLoadError: expect.any(Function),
        onRiveReady: expect.any(Function),
        onPause: expect.any(Function),
        onPlay: expect.any(Function),
        onStop: expect.any(Function),
      })
    );
  });
});

describe("Persona - Callback Execution", () => {
  it("invokes onLoad callback when rive loads", () => {
    const onLoad = vi.fn();

    mockUseRive.mockImplementation((params) => {
      // Simulate calling onLoad
      params.onLoad?.({ artboard: "test" });
      return {
        rive: {},
        RiveComponent: MockRiveComponent,
      };
    });

    render(<Persona onLoad={onLoad} state="idle" />);

    expect(onLoad).toHaveBeenCalledWith({ artboard: "test" });
  });

  it("invokes onLoadError callback on error", () => {
    const onLoadError = vi.fn();
    const testError = new Error("Test error");

    mockUseRive.mockImplementation((params) => {
      // Simulate calling onLoadError
      params.onLoadError?.(testError);
      return {
        rive: {},
        RiveComponent: MockRiveComponent,
      };
    });

    render(<Persona onLoadError={onLoadError} state="idle" />);

    expect(onLoadError).toHaveBeenCalledWith(testError);
  });

  it("invokes onReady callback when rive is ready", () => {
    const onReady = vi.fn();

    mockUseRive.mockImplementation((params) => {
      // Simulate calling onRiveReady
      params.onRiveReady?.();
      return {
        rive: {},
        RiveComponent: MockRiveComponent,
      };
    });

    render(<Persona onReady={onReady} state="idle" />);

    expect(onReady).toHaveBeenCalled();
  });

  it("invokes onPause callback when paused", () => {
    const onPause = vi.fn();
    const pauseEvent = { type: "pause" };

    mockUseRive.mockImplementation((params) => {
      params.onPause?.(pauseEvent);
      return {
        rive: {},
        RiveComponent: MockRiveComponent,
      };
    });

    render(<Persona onPause={onPause} state="idle" />);

    expect(onPause).toHaveBeenCalledWith(pauseEvent);
  });

  it("invokes onPlay callback when played", () => {
    const onPlay = vi.fn();
    const playEvent = { type: "play" };

    mockUseRive.mockImplementation((params) => {
      params.onPlay?.(playEvent);
      return {
        rive: {},
        RiveComponent: MockRiveComponent,
      };
    });

    render(<Persona onPlay={onPlay} state="idle" />);

    expect(onPlay).toHaveBeenCalledWith(playEvent);
  });

  it("invokes onStop callback when stopped", () => {
    const onStop = vi.fn();
    const stopEvent = { type: "stop" };

    mockUseRive.mockImplementation((params) => {
      params.onStop?.(stopEvent);
      return {
        rive: {},
        RiveComponent: MockRiveComponent,
      };
    });

    render(<Persona onStop={onStop} state="idle" />);

    expect(onStop).toHaveBeenCalledWith(stopEvent);
  });
});

describe("Persona - Asleep State", () => {
  it("sets asleep input to true when state is asleep", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };
    const mockAsleepInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      if (input === "asleep") {
        return mockAsleepInput;
      }
      return { value: false };
    });

    render(<Persona state="asleep" />);

    await waitFor(() => {
      expect(mockAsleepInput.value).toBe(true);
      expect(mockListeningInput.value).toBe(false);
      expect(mockThinkingInput.value).toBe(false);
      expect(mockSpeakingInput.value).toBe(false);
    });
  });
});

describe("Persona - Invalid Variant", () => {
  it("throws error for invalid variant", () => {
    expect(() => {
      // @ts-expect-error - testing invalid variant
      render(<Persona state="idle" variant="invalid-variant" />);
    }).toThrow("Invalid variant: invalid-variant");
  });
});

describe("Persona - Dynamic Color", () => {
  it("sets RGB to white in dark theme for dynamic color variants", async () => {
    const mockSetRgb = vi.fn();
    mockUseViewModelInstanceColor.mockReturnValue({ setRgb: mockSetRgb });

    // Mock dark theme
    document.documentElement.classList.add("dark");

    render(<Persona state="idle" variant="obsidian" />);

    await waitFor(() => {
      expect(mockSetRgb).toHaveBeenCalledWith(255, 255, 255);
    });

    document.documentElement.classList.remove("dark");
  });

  it("sets RGB to black in light theme for dynamic color variants", async () => {
    const mockSetRgb = vi.fn();
    mockUseViewModelInstanceColor.mockReturnValue({ setRgb: mockSetRgb });

    // Ensure light theme
    document.documentElement.classList.remove("dark");

    render(<Persona state="idle" variant="obsidian" />);

    await waitFor(() => {
      expect(mockSetRgb).toHaveBeenCalledWith(0, 0, 0);
    });
  });

  it("does not set RGB for non-dynamic-color variants", async () => {
    const mockSetRgb = vi.fn();
    mockUseViewModelInstanceColor.mockReturnValue({ setRgb: mockSetRgb });

    render(<Persona state="idle" variant="mana" />);

    // Wait a bit to ensure effect has run
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockSetRgb).not.toHaveBeenCalled();
  });

  it("does not set RGB when viewModelInstanceColor is null", () => {
    mockUseViewModelInstanceColor.mockReturnValue(null);

    // Should not throw
    expect(() => {
      render(<Persona state="idle" variant="obsidian" />);
    }).not.toThrow();
  });

  it("uses PersonaWithoutModel for variants without model", () => {
    // opal variant has hasModel: false
    render(<Persona state="idle" variant="opal" />);

    // Should not call useViewModel or useViewModelInstance for non-model variants
    // (This is implicitly tested by the component rendering without error)
    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/orb-1.2.riv",
      })
    );
  });
});

describe("Persona - Integration", () => {
  it("renders with all props combined", async () => {
    const mockListeningInput = { value: false };
    const mockThinkingInput = { value: false };
    const mockSpeakingInput = { value: false };

    mockUseStateMachineInput.mockImplementation((_rive, _sm, input) => {
      if (input === "listening") {
        return mockListeningInput;
      }
      if (input === "thinking") {
        return mockThinkingInput;
      }
      if (input === "speaking") {
        return mockSpeakingInput;
      }
      return { value: false };
    });

    MockRiveComponent.mockImplementation(({ className }) => (
      <div className={className} data-testid="rive-component" />
    ));

    const callbacks = {
      onLoad: vi.fn(),
      onReady: vi.fn(),
      onPlay: vi.fn(),
    };

    const { getByTestId } = render(
      <Persona
        className="size-64 rounded-full"
        onLoad={callbacks.onLoad}
        onPlay={callbacks.onPlay}
        onReady={callbacks.onReady}
        state="listening"
        variant="halo"
      />
    );

    // Check render
    const component = getByTestId("rive-component");
    expect(component).toBeInTheDocument();

    // Check className
    expect(component.className).toContain("size-64");
    expect(component.className).toContain("rounded-full");

    // Check variant
    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/halo-2.0.riv",
      })
    );

    // Check callbacks are passed (wrapped in stable refs)
    expect(mockUseRive).toHaveBeenCalledWith(
      expect.objectContaining({
        onLoad: expect.any(Function),
        onRiveReady: expect.any(Function),
        onPlay: expect.any(Function),
      })
    );

    // Check state
    await waitFor(() => {
      expect(mockListeningInput.value).toBe(true);
    });
  });

  it("uses 'default' as the state machine name for all variants", () => {
    const variants = [
      "obsidian",
      "mana",
      "opal",
      "halo",
      "glint",
      "command",
    ] as const;

    for (const variant of variants) {
      mockUseRive.mockClear();
      render(<Persona state="idle" variant={variant} />);

      expect(mockUseRive).toHaveBeenCalledWith(
        expect.objectContaining({
          stateMachines: "default",
        })
      );
    }
  });

  it("always sets autoplay to true", () => {
    const states = [
      "idle",
      "listening",
      "thinking",
      "speaking",
      "asleep",
    ] as const;

    for (const state of states) {
      mockUseRive.mockClear();
      render(<Persona state={state} />);

      expect(mockUseRive).toHaveBeenCalledWith(
        expect.objectContaining({
          autoplay: true,
        })
      );
    }
  });
});
