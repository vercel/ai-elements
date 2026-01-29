import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SpeechInput } from "../src/speech-input";

// Mock SpeechRecognition
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = "";
  onstart: ((ev: Event) => void) | null = null;
  onend: ((ev: Event) => void) | null = null;
  onresult: ((ev: any) => void) | null = null;
  onerror: ((ev: any) => void) | null = null;

  start() {
    if (this.onstart) {
      this.onstart(new Event("start"));
    }
  }

  stop() {
    if (this.onend) {
      this.onend(new Event("end"));
    }
  }
}

// Mock console methods
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  // Reset window.SpeechRecognition - delete properties instead of setting to undefined
  // because `in` operator checks property existence, not value
  // biome-ignore lint/performance/noDelete: delete required for `in` operator check
  delete (window as any).SpeechRecognition;
  // biome-ignore lint/performance/noDelete: delete required for `in` operator check
  delete (window as any).webkitSpeechRecognition;

  // Reset MediaRecorder to ensure consistent test behavior
  // biome-ignore lint/performance/noDelete: delete required for `in` operator check
  delete (window as any).MediaRecorder;
  // Also mock navigator.mediaDevices to be undefined
  Object.defineProperty(navigator, "mediaDevices", {
    value: undefined,
    writable: true,
    configurable: true,
  });
});

describe("SpeechInput", () => {
  it("renders button with microphone icon", () => {
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("is disabled when SpeechRecognition is not available", () => {
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is enabled when SpeechRecognition is available", () => {
    (window as any).SpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("works with webkit prefix", () => {
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("applies custom className", () => {
    (window as any).SpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput className="custom-class" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("accepts Button props", () => {
    (window as any).SpeechRecognition = MockSpeechRecognition;
    render(<SpeechInput size="lg" variant="outline" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});

describe("SpeechInput - Speech Recognition", () => {
  beforeEach(() => {
    (window as any).SpeechRecognition = MockSpeechRecognition;
  });

  it("initializes SpeechRecognition with correct settings", async () => {
    render(<SpeechInput />);

    await waitFor(() => {
      // The component should have initialized recognition
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  it("starts listening when clicked", async () => {
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
    const user = userEvent.setup();

    const { container } = render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");

    // Should not have animate-ping divs initially
    expect(container.querySelectorAll(".animate-ping").length).toBe(0);

    await user.click(button);

    // Should have animate-ping divs when listening
    await waitFor(
      () => {
        expect(container.querySelectorAll(".animate-ping").length).toBe(3);
      },
      { timeout: 3000 }
    );
  });

  it("calls onTranscriptionChange with final transcript", async () => {
    const handleTranscription = vi.fn();
    let recognitionInstance: any = null;

    // Override MockSpeechRecognition to capture the instance
    class TrackableMockSpeechRecognition extends MockSpeechRecognition {
      constructor() {
        super();
        recognitionInstance = this;
      }
    }

    (window as any).SpeechRecognition = TrackableMockSpeechRecognition;

    render(<SpeechInput onTranscriptionChange={handleTranscription} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(recognitionInstance).not.toBeNull();
    });

    // Simulate speech recognition result with final transcript
    if (recognitionInstance?.onresult) {
      recognitionInstance.onresult({
        resultIndex: 0,
        results: {
          length: 1,
          0: {
            0: { transcript: "Hello world", confidence: 0.9 },
            isFinal: true,
            length: 1,
            item: (_index: number) => ({
              transcript: "Hello world",
              confidence: 0.9,
            }),
          },
        },
      });
    }

    await waitFor(() => {
      expect(handleTranscription).toHaveBeenCalledWith("Hello world");
    });
  });

  it("does not call onTranscriptionChange for interim results", async () => {
    const handleTranscription = vi.fn();
    let recognitionInstance: any = null;

    class TrackableMockSpeechRecognition extends MockSpeechRecognition {
      constructor() {
        super();
        recognitionInstance = this;
      }
    }

    (window as any).SpeechRecognition = TrackableMockSpeechRecognition;

    render(<SpeechInput onTranscriptionChange={handleTranscription} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(recognitionInstance).not.toBeNull();
    });

    // Simulate interim result (should not trigger callback)
    if (recognitionInstance?.onresult) {
      recognitionInstance.onresult({
        resultIndex: 0,
        results: {
          length: 1,
          0: {
            0: { transcript: "Hello", confidence: 0.5 },
            isFinal: false,
            length: 1,
            item: (_index: number) => ({
              transcript: "Hello",
              confidence: 0.5,
            }),
          },
        },
      });
    }

    // Wait a bit to ensure callback wasn't called
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(handleTranscription).not.toHaveBeenCalled();
  });

  it("handles speech recognition errors and logs them", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let recognitionInstance: any = null;

    class TrackableMockSpeechRecognition extends MockSpeechRecognition {
      constructor() {
        super();
        recognitionInstance = this;
      }
    }

    (window as any).SpeechRecognition = TrackableMockSpeechRecognition;

    render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(recognitionInstance).not.toBeNull();
    });

    // Trigger error event
    if (recognitionInstance?.onerror) {
      recognitionInstance.onerror({ error: "no-speech" });
    }

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Speech recognition error:",
        "no-speech"
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("handles empty transcript gracefully", async () => {
    const handleTranscription = vi.fn();
    let recognitionInstance: any = null;

    class TrackableMockSpeechRecognition extends MockSpeechRecognition {
      constructor() {
        super();
        recognitionInstance = this;
      }
    }

    (window as any).SpeechRecognition = TrackableMockSpeechRecognition;

    render(<SpeechInput onTranscriptionChange={handleTranscription} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    await waitFor(() => {
      expect(recognitionInstance).not.toBeNull();
    });

    // Simulate result with empty transcript
    if (recognitionInstance?.onresult) {
      recognitionInstance.onresult({
        resultIndex: 0,
        results: {
          length: 1,
          0: {
            0: { transcript: "", confidence: 0.9 },
            isFinal: true,
            length: 1,
            item: (_index: number) => ({ transcript: "", confidence: 0.9 }),
          },
        },
      });
    }

    // Wait to ensure callback wasn't called for empty transcript
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(handleTranscription).not.toHaveBeenCalled();
  });

  it("does nothing when clicking button if recognition is not available", async () => {
    // No SpeechRecognition available - delete properties to ensure `in` check fails
    // biome-ignore lint/performance/noDelete: delete required for `in` operator check
    delete (window as any).SpeechRecognition;
    // biome-ignore lint/performance/noDelete: delete required for `in` operator check
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
    const stopSpy = vi.spyOn(MockSpeechRecognition.prototype, "stop");

    const { unmount } = render(<SpeechInput />);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    unmount();

    expect(stopSpy).toHaveBeenCalled();
  });
});

describe("SpeechInput - MediaRecorder Fallback", () => {
  let mockTrack: any;
  let mockStream: any;
  let mediaRecorderInstances: any[];

  // Mock MediaRecorder class that captures instances
  class MockMediaRecorder {
    state = "inactive";
    ondataavailable: ((event: any) => void) | null = null;
    onstop: (() => void) | null = null;
    onerror: ((event: any) => void) | null = null;

    constructor() {
      mediaRecorderInstances.push(this);
    }

    start = vi.fn(() => {
      this.state = "recording";
    });

    stop = vi.fn(() => {
      this.state = "inactive";
      if (this.onstop) {
        this.onstop();
      }
    });
  }

  beforeEach(() => {
    mediaRecorderInstances = [];

    // Remove SpeechRecognition to force MediaRecorder mode - delete properties
    // biome-ignore lint/performance/noDelete: delete required for `in` operator check
    delete (window as any).SpeechRecognition;
    // biome-ignore lint/performance/noDelete: delete required for `in` operator check
    delete (window as any).webkitSpeechRecognition;

    // Create mock track
    mockTrack = {
      stop: vi.fn(),
    };

    // Create mock stream
    mockStream = {
      getTracks: vi.fn(() => [mockTrack]),
    };

    // Mock MediaRecorder constructor
    (window as any).MediaRecorder = MockMediaRecorder;

    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
      },
      writable: true,
      configurable: true,
    });
  });

  it("is disabled when onAudioRecorded is not provided", async () => {
    render(<SpeechInput />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  it("is enabled when onAudioRecorded is provided", async () => {
    const handleAudioRecorded = vi.fn().mockResolvedValue("test transcript");

    render(<SpeechInput onAudioRecorded={handleAudioRecorded} />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  it("starts recording when clicked", async () => {
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
      expect(mediaRecorderInstances.length).toBeGreaterThan(0);
      expect(mediaRecorderInstances[0].start).toHaveBeenCalled();
    });
  });

  it("stops recording and transcribes when clicked again", async () => {
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
      expect(mediaRecorderInstances.length).toBeGreaterThan(0);
    });

    const recorder = mediaRecorderInstances[0];

    // Simulate data available
    if (recorder.ondataavailable) {
      recorder.ondataavailable({
        data: new Blob(["test"], { type: "audio/webm" }),
      });
    }

    // Stop recording (second click)
    await user.click(button);

    await waitFor(() => {
      expect(handleAudioRecorded).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(handleTranscriptionChange).toHaveBeenCalledWith(
        "transcribed text"
      );
    });
  });

  it("releases microphone tracks on stop", async () => {
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
      expect(mediaRecorderInstances.length).toBeGreaterThan(0);
    });

    const recorder = mediaRecorderInstances[0];

    // Simulate data available
    if (recorder.ondataavailable) {
      recorder.ondataavailable({
        data: new Blob(["test"], { type: "audio/webm" }),
      });
    }

    // Stop recording
    await user.click(button);

    await waitFor(() => {
      expect(mockTrack.stop).toHaveBeenCalled();
    });
  });

  it("handles transcription errors gracefully", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
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
      expect(mediaRecorderInstances.length).toBeGreaterThan(0);
    });

    const recorder = mediaRecorderInstances[0];

    // Simulate data available
    if (recorder.ondataavailable) {
      recorder.ondataavailable({
        data: new Blob(["test"], { type: "audio/webm" }),
      });
    }

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
