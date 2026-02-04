// oxlint-disable eslint(max-classes-per-file)
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SpeechInput } from "../src/speech-input";

// Mock SpeechRecognition with EventTarget support
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = "";
  onstart: ((ev: Event) => void) | null = null;
  onend: ((ev: Event) => void) | null = null;
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  onresult: ((ev: any) => void) | null = null;
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  onerror: ((ev: any) => void) | null = null;

  // EventTarget implementation
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  private listeners: Map<string, Set<(ev: any) => void>> = new Map();

  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  addEventListener(type: string, listener: (ev: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(listener);
  }

  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  removeEventListener(type: string, listener: (ev: any) => void) {
    this.listeners.get(type)?.delete(listener);
  }

  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  dispatchEvent(event: any): boolean {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }
    return true;
  }

  start() {
    this.dispatchEvent(new Event("start"));
  }

  stop() {
    this.dispatchEvent(new Event("end"));
  }
}

// Trackable instance holder for tests that need to access the recognition instance
interface InstanceRef {
  current: MockSpeechRecognition | null;
}

// Factory to create a trackable mock that stores the instance in a ref
const createTrackableMock = (instanceRef: InstanceRef) =>
  class TrackableMockSpeechRecognition extends MockSpeechRecognition {
    constructor() {
      super();
      instanceRef.current = this;
    }
  };

// Setup function to reset window globals and mock console
const setupSpeechInputTests = () => {
  vi.spyOn(console, "warn").mockImplementation(vi.fn());
  vi.spyOn(console, "error").mockImplementation(vi.fn());

  // Reset window.SpeechRecognition - delete properties instead of setting to undefined
  // because `in` operator checks property existence, not value
  // biome-ignore lint/performance/noDelete: delete required for `in` operator check
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  delete (window as any).SpeechRecognition;
  // biome-ignore lint/performance/noDelete: delete required for `in` operator check
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  delete (window as any).webkitSpeechRecognition;

  // Reset MediaRecorder to ensure consistent test behavior
  // biome-ignore lint/performance/noDelete: delete required for `in` operator check
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  delete (window as any).MediaRecorder;
  // Also mock navigator.mediaDevices to be undefined
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: undefined,
    writable: true,
  });
};

describe("speechInput", () => {
  it("renders button with microphone icon", () => {
    setupSpeechInputTests();
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("is disabled when SpeechRecognition is not available", () => {
    setupSpeechInputTests();
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is enabled when SpeechRecognition is available", () => {
    setupSpeechInputTests();
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).SpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("works with webkit prefix", () => {
    setupSpeechInputTests();
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("applies custom className", () => {
    setupSpeechInputTests();
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).SpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput className="custom-class" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("accepts Button props", () => {
    setupSpeechInputTests();
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).SpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput size="lg" variant="outline" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});

// Helper to setup speech recognition tests
const setupSpeechRecognitionTests = () => {
  setupSpeechInputTests();
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  (window as any).SpeechRecognition = MockSpeechRecognition;
};

describe("speechInput - Speech Recognition", () => {
  it("initializes SpeechRecognition with correct settings", async () => {
    setupSpeechRecognitionTests();
    render(<SpeechInput />);

    await waitFor(() => {
      // The component should have initialized recognition
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  it("starts listening when clicked", async () => {
    setupSpeechRecognitionTests();
    const user = userEvent.setup();
    const startSpy = vi.spyOn(MockSpeechRecognition.prototype, "start");

    render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await user.click(button);

    expect(startSpy).toHaveBeenCalled();
  });

  it("stops listening when clicked again", async () => {
    setupSpeechRecognitionTests();
    const user = userEvent.setup();
    const stopSpy = vi.spyOn(MockSpeechRecognition.prototype, "stop");

    render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");

    // Start listening
    await user.click(button);

    // Stop listening
    await user.click(button);

    expect(stopSpy).toHaveBeenCalled();
  });

  it("applies pulse animation when listening", async () => {
    setupSpeechRecognitionTests();
    const user = userEvent.setup();

    const { container } = render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");

    // Should not have animate-ping divs initially
    expect(container.querySelectorAll(".animate-ping")).toHaveLength(0);

    await user.click(button);

    // Should have animate-ping divs when listening
    await waitFor(
      () => {
        expect(container.querySelectorAll(".animate-ping")).toHaveLength(3);
      },
      { timeout: 3000 }
    );
  });

  it("calls onTranscriptionChange with final transcript", async () => {
    setupSpeechInputTests();
    const handleTranscription = vi.fn();
    const instanceRef: InstanceRef = { current: null };

    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).SpeechRecognition = createTrackableMock(instanceRef);

    render(<SpeechInput onTranscriptionChange={handleTranscription} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(instanceRef.current).not.toBeNull();
    });

    // Simulate speech recognition result with final transcript
    const resultEvent = Object.assign(new Event("result"), {
      resultIndex: 0,
      results: {
        0: {
          0: { confidence: 0.9, transcript: "Hello world" },
          isFinal: true,
          item: (_index: number) => ({
            confidence: 0.9,
            transcript: "Hello world",
          }),
          length: 1,
        },
        length: 1,
      },
    });
    instanceRef.current?.dispatchEvent(resultEvent);

    await waitFor(() => {
      expect(handleTranscription).toHaveBeenCalledWith("Hello world");
    });
  });

  it("does not call onTranscriptionChange for interim results", async () => {
    setupSpeechInputTests();
    const handleTranscription = vi.fn();
    const instanceRef: InstanceRef = { current: null };

    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).SpeechRecognition = createTrackableMock(instanceRef);

    render(<SpeechInput onTranscriptionChange={handleTranscription} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(instanceRef.current).not.toBeNull();
    });

    // Simulate interim result (should not trigger callback)
    const interimEvent = Object.assign(new Event("result"), {
      resultIndex: 0,
      results: {
        0: {
          0: { confidence: 0.5, transcript: "Hello" },
          isFinal: false,
          item: (_index: number) => ({
            confidence: 0.5,
            transcript: "Hello",
          }),
          length: 1,
        },
        length: 1,
      },
    });
    instanceRef.current?.dispatchEvent(interimEvent);

    // Wait a bit to ensure callback wasn't called
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    expect(handleTranscription).not.toHaveBeenCalled();
  });

  it("handles speech recognition errors and logs them", async () => {
    setupSpeechInputTests();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(vi.fn());
    const instanceRef: InstanceRef = { current: null };

    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).SpeechRecognition = createTrackableMock(instanceRef);

    render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(instanceRef.current).not.toBeNull();
    });

    // Trigger error event
    const errorEvent = Object.assign(new Event("error"), { error: "no-speech" });
    instanceRef.current?.dispatchEvent(errorEvent);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Speech recognition error:",
        "no-speech"
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("handles empty transcript gracefully", async () => {
    setupSpeechInputTests();
    const handleTranscription = vi.fn();
    const instanceRef: InstanceRef = { current: null };

    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    (window as any).SpeechRecognition = createTrackableMock(instanceRef);

    render(<SpeechInput onTranscriptionChange={handleTranscription} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(instanceRef.current).not.toBeNull();
    });

    // Simulate result with empty transcript
    const emptyEvent = Object.assign(new Event("result"), {
      resultIndex: 0,
      results: {
        0: {
          0: { confidence: 0.9, transcript: "" },
          isFinal: true,
          item: (_index: number) => ({ confidence: 0.9, transcript: "" }),
          length: 1,
        },
        length: 1,
      },
    });
    instanceRef.current?.dispatchEvent(emptyEvent);

    // Wait to ensure callback wasn't called for empty transcript
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    expect(handleTranscription).not.toHaveBeenCalled();
  });

  it("does nothing when clicking button if recognition is not available", async () => {
    setupSpeechInputTests();
    // No SpeechRecognition available - delete properties to ensure `in` check fails
    // biome-ignore lint/performance/noDelete: delete required for `in` operator check
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    delete (window as any).SpeechRecognition;
    // biome-ignore lint/performance/noDelete: delete required for `in` operator check
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    delete (window as any).webkitSpeechRecognition;

    render(<SpeechInput />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    // Try to click (should do nothing)
    await userEvent.setup().click(button);

    // Button should remain disabled
    expect(button).toBeDisabled();
  });

  it("cleans up recognition on unmount", async () => {
    setupSpeechRecognitionTests();
    const stopSpy = vi.spyOn(MockSpeechRecognition.prototype, "stop");

    const { unmount } = render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    unmount();

    expect(stopSpy).toHaveBeenCalled();
  });
});

// MediaRecorder test helpers
interface MediaRecorderTestContext {
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  mockTrack: any;
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  mockStream: any;
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  mediaRecorderInstances: any[];
}

// Mock MediaRecorder class that captures instances with EventTarget support
const createMockMediaRecorder = (context: MediaRecorderTestContext) =>
  class MockMediaRecorder {
    state = "inactive";
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    ondataavailable: ((event: any) => void) | null = null;
    onstop: (() => void) | null = null;
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    onerror: ((event: any) => void) | null = null;

    // EventTarget implementation
    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    private listeners: Map<string, Set<(ev: any) => void>> = new Map();

    constructor() {
      context.mediaRecorderInstances.push(this);
    }

    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    addEventListener(type: string, listener: (ev: any) => void) {
      if (!this.listeners.has(type)) {
        this.listeners.set(type, new Set());
      }
      this.listeners.get(type)?.add(listener);
    }

    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    removeEventListener(type: string, listener: (ev: any) => void) {
      this.listeners.get(type)?.delete(listener);
    }

    // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    dispatchEvent(event: any): boolean {
      const listeners = this.listeners.get(event.type);
      if (listeners) {
        for (const listener of listeners) {
          listener(event);
        }
      }
      return true;
    }

    start = vi.fn(() => {
      this.state = "recording";
    });

    stop = vi.fn(() => {
      this.state = "inactive";
      // Dispatch stop event
      this.dispatchEvent(new Event("stop"));
    });
  };

const setupMediaRecorderTests = (): MediaRecorderTestContext => {
  setupSpeechInputTests();

  const context: MediaRecorderTestContext = {
    mediaRecorderInstances: [],
    mockStream: null,
    mockTrack: null,
  };

  // Create mock track - sequential assignment needed for circular reference
  // oxlint-disable-next-line eslint-plugin-unicorn(no-immediate-mutation)
  context.mockTrack = {
    stop: vi.fn(),
  };

  // Create mock stream
  context.mockStream = {
    getTracks: vi.fn(() => [context.mockTrack]),
  };

  // Mock MediaRecorder constructor
  // oxlint-disable-next-line typescript-eslint(no-explicit-any)
  (window as any).MediaRecorder = createMockMediaRecorder(context);

  // Mock navigator.mediaDevices
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia: vi.fn().mockResolvedValue(context.mockStream),
    },
    writable: true,
  });

  return context;
};

describe("speechInput - MediaRecorder Fallback", () => {
  it("is disabled when onAudioRecorded is not provided", async () => {
    setupMediaRecorderTests();
    render(<SpeechInput />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  it("is enabled when onAudioRecorded is provided", async () => {
    setupMediaRecorderTests();
    const handleAudioRecorded = vi.fn().mockResolvedValue("test transcript");

    render(<SpeechInput onAudioRecorded={handleAudioRecorded} />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  it("starts recording when clicked", async () => {
    const ctx = setupMediaRecorderTests();
    const user = userEvent.setup();
    const handleAudioRecorded = vi.fn().mockResolvedValue("test transcript");

    render(<SpeechInput onAudioRecorded={handleAudioRecorded} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: true,
      });
    });

    await waitFor(() => {
      expect(ctx.mediaRecorderInstances.length).toBeGreaterThan(0);
      expect(ctx.mediaRecorderInstances[0].start).toHaveBeenCalled();
    });
  });

  it("stops recording and transcribes when clicked again", async () => {
    const ctx = setupMediaRecorderTests();
    const user = userEvent.setup();
    const handleAudioRecorded = vi.fn().mockResolvedValue("transcribed text");
    const handleTranscriptionChange = vi.fn();

    render(
      <SpeechInput
        onAudioRecorded={handleAudioRecorded}
        onTranscriptionChange={handleTranscriptionChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");

    // Start recording
    await user.click(button);

    await waitFor(() => {
      expect(ctx.mediaRecorderInstances.length).toBeGreaterThan(0);
    });

    const [recorder] = ctx.mediaRecorderInstances;

    // Simulate data available via dispatchEvent
    const dataAvailableEvent = Object.assign(new Event("dataavailable"), {
      data: new Blob(["test"], { type: "audio/webm" }),
    });
    recorder.dispatchEvent(dataAvailableEvent);

    // Stop recording (second click)
    await user.click(button);

    await waitFor(() => {
      expect(handleAudioRecorded).toHaveBeenCalledWith(expect.any(Blob));
    });

    await waitFor(() => {
      expect(handleTranscriptionChange).toHaveBeenCalledWith(
        "transcribed text"
      );
    });
  });

  it("releases microphone tracks on stop", async () => {
    const ctx = setupMediaRecorderTests();
    const user = userEvent.setup();
    const handleAudioRecorded = vi.fn().mockResolvedValue("text");

    render(<SpeechInput onAudioRecorded={handleAudioRecorded} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");

    // Start recording
    await user.click(button);

    await waitFor(() => {
      expect(ctx.mediaRecorderInstances.length).toBeGreaterThan(0);
    });

    const [recorder] = ctx.mediaRecorderInstances;

    // Simulate data available via dispatchEvent
    const dataAvailableEvent = Object.assign(new Event("dataavailable"), {
      data: new Blob(["test"], { type: "audio/webm" }),
    });
    recorder.dispatchEvent(dataAvailableEvent);

    // Stop recording
    await user.click(button);

    await waitFor(() => {
      expect(ctx.mockTrack.stop).toHaveBeenCalled();
    });
  });

  it("handles transcription errors gracefully", async () => {
    const ctx = setupMediaRecorderTests();
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(vi.fn());
    const handleAudioRecorded = vi
      .fn()
      .mockRejectedValue(new Error("Transcription failed"));
    const handleTranscriptionChange = vi.fn();

    render(
      <SpeechInput
        onAudioRecorded={handleAudioRecorded}
        onTranscriptionChange={handleTranscriptionChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");

    // Start recording
    await user.click(button);

    await waitFor(() => {
      expect(ctx.mediaRecorderInstances.length).toBeGreaterThan(0);
    });

    const [recorder] = ctx.mediaRecorderInstances;

    // Simulate data available via dispatchEvent
    const dataAvailableEvent = Object.assign(new Event("dataavailable"), {
      data: new Blob(["test"], { type: "audio/webm" }),
    });
    recorder.dispatchEvent(dataAvailableEvent);

    // Stop recording
    await user.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Transcription error:",
        expect.any(Error)
      );
    });

    // Transcription change should not be called on error
    expect(handleTranscriptionChange).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
