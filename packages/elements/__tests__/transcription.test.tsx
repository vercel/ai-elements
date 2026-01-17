import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Experimental_TranscriptionResult as TranscriptionResult } from "ai";
import { describe, expect, it, vi } from "vitest";
import { Transcription, TranscriptionSegment } from "../src/transcription";

const mockSegments: TranscriptionResult["segments"] = [
  {
    text: "Hello",
    startSecond: 0,
    endSecond: 1,
  },
  {
    text: "world",
    startSecond: 1,
    endSecond: 2,
  },
  {
    text: "from",
    startSecond: 2,
    endSecond: 3,
  },
  {
    text: "AI",
    startSecond: 3,
    endSecond: 4,
  },
];

const mockSegmentsWithEmpty: TranscriptionResult["segments"] = [
  {
    text: "Hello",
    startSecond: 0,
    endSecond: 1,
  },
  {
    text: "   ",
    startSecond: 1,
    endSecond: 1.5,
  },
  {
    text: "",
    startSecond: 1.5,
    endSecond: 2,
  },
  {
    text: "world",
    startSecond: 2,
    endSecond: 3,
  },
];

describe("Transcription", () => {
  describe("Transcription", () => {
    it("renders with render props children", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("world")).toBeInTheDocument();
      expect(screen.getByText("from")).toBeInTheDocument();
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <Transcription className="custom-transcription" segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const transcription = container.querySelector(
        '[data-slot="transcription"]'
      );
      expect(transcription).toHaveClass("custom-transcription");
    });

    it("applies default flex layout classes", () => {
      const { container } = render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const transcription = container.querySelector(
        '[data-slot="transcription"]'
      );
      expect(transcription).toHaveClass(
        "flex",
        "flex-wrap",
        "gap-1",
        "text-sm",
        "leading-relaxed"
      );
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      expect(
        container.querySelector('[data-slot="transcription"]')
      ).toBeInTheDocument();
    });

    it("filters out empty segments", () => {
      render(
        <Transcription segments={mockSegmentsWithEmpty}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("world")).toBeInTheDocument();

      // Should only render 2 segments (empty ones filtered out)
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("uses controlled currentTime when provided", () => {
      const { container } = render(
        <Transcription currentTime={1.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // Second segment (1-2s) should be active at 1.5s
      const activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toBeInTheDocument();
      expect(activeSegment).toHaveTextContent("world");
    });

    it("defaults to 0 when currentTime not provided", () => {
      const { container } = render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // First segment (0-1s) should be active at time 0
      const activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toBeInTheDocument();
      expect(activeSegment).toHaveTextContent("Hello");
    });

    it("calls onSeek when provided", async () => {
      const user = userEvent.setup();
      const onSeek = vi.fn();

      render(
        <Transcription onSeek={onSeek} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const secondSegment = screen.getByText("world");
      await user.click(secondSegment);

      expect(onSeek).toHaveBeenCalledWith(1);
    });

    it("updates currentTime via useControllableState", async () => {
      const user = userEvent.setup();
      const onSeek = vi.fn();

      const { rerender } = render(
        <Transcription currentTime={0} onSeek={onSeek} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // Click third segment (2-3s)
      const thirdSegment = screen.getByText("from");
      await user.click(thirdSegment);

      expect(onSeek).toHaveBeenCalledWith(2);

      // Simulate parent updating currentTime
      rerender(
        <Transcription
          currentTime={2.5}
          onSeek={onSeek}
          segments={mockSegments}
        >
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // Third segment should now be active
      expect(thirdSegment.closest("button")).toHaveAttribute(
        "data-active",
        "true"
      );
    });

    it("renders all segments with render function", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <div data-testid={`segment-${index}`} key={index}>
              {segment.text}
            </div>
          )}
        </Transcription>
      );

      expect(screen.getByTestId("segment-0")).toHaveTextContent("Hello");
      expect(screen.getByTestId("segment-1")).toHaveTextContent("world");
      expect(screen.getByTestId("segment-2")).toHaveTextContent("from");
      expect(screen.getByTestId("segment-3")).toHaveTextContent("AI");
    });
  });

  describe("TranscriptionSegment", () => {
    it("renders segment text", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const segment = screen.getByText("Hello");
      expect(segment).toBeInTheDocument();
    });

    it("renders as button element", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      expect(
        container.querySelector('[data-slot="transcription-segment"]')
      ).toBeInTheDocument();
    });

    it("has data-index attribute", () => {
      const { container } = render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const segments = container.querySelectorAll(
        '[data-slot="transcription-segment"]'
      );
      expect(segments[0]).toHaveAttribute("data-index", "0");
      expect(segments[1]).toHaveAttribute("data-index", "1");
      expect(segments[2]).toHaveAttribute("data-index", "2");
    });

    it("applies active styling when current", () => {
      const { container } = render(
        <Transcription currentTime={2.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toHaveClass("text-primary");
      expect(activeSegment).toHaveTextContent("from"); // 2-3s
    });

    it("applies past styling when segment is past", () => {
      render(
        <Transcription currentTime={3.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const firstSegment = screen.getByText("Hello");
      expect(firstSegment).toHaveClass("text-muted-foreground");
    });

    it("applies future styling when segment is future", () => {
      render(
        <Transcription currentTime={0.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const futureSegment = screen.getByText("world"); // 1-2s
      expect(futureSegment).toHaveClass("text-muted-foreground/60");
    });

    it("applies pointer cursor when onSeek provided", () => {
      render(
        <Transcription onSeek={vi.fn()} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const segment = screen.getByText("Hello");
      expect(segment).toHaveClass("cursor-pointer");
    });

    it("applies default cursor when onSeek not provided", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const segment = screen.getByText("Hello");
      expect(segment).toHaveClass("cursor-default");
    });

    it("calls onSeek with segment start time on click", async () => {
      const user = userEvent.setup();
      const onSeek = vi.fn();

      render(
        <Transcription onSeek={onSeek} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const thirdSegment = screen.getByText("from");
      await user.click(thirdSegment);

      expect(onSeek).toHaveBeenCalledWith(2); // startSecond of "from"
    });

    it("does not call onSeek when not provided", async () => {
      const user = userEvent.setup();
      const onSeek = vi.fn();

      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const segment = screen.getByText("Hello");
      await user.click(segment);

      expect(onSeek).not.toHaveBeenCalled();
    });

    it("still calls custom onClick when provided", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onSeek = vi.fn();

      render(
        <Transcription onSeek={onSeek} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              onClick={onClick}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const segment = screen.getByText("Hello");
      await user.click(segment);

      expect(onSeek).toHaveBeenCalledWith(0);
      expect(onClick).toHaveBeenCalled();
    });

    it("applies custom className", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              className="custom-segment"
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const segment = screen.getByText("Hello");
      expect(segment).toHaveClass("custom-segment");
    });

    it("has type button", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        expect(button).toHaveAttribute("type", "button");
      }
    });

    it("throws error when used outside Transcription context", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      expect(() => {
        render(<TranscriptionSegment index={0} segment={mockSegments[0]} />);
      }).toThrow("Transcription components must be used within Transcription");

      consoleSpy.mockRestore();
    });
  });

  describe("Integration", () => {
    it("renders complete transcription with all segments", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("world")).toBeInTheDocument();
      expect(screen.getByText("from")).toBeInTheDocument();
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    it("updates active segment as time progresses", () => {
      const { rerender, container } = render(
        <Transcription currentTime={0.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // At 0.5s, first segment should be active
      let activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toHaveTextContent("Hello");

      // Update to 1.5s
      rerender(
        <Transcription currentTime={1.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // Second segment should now be active
      activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toHaveTextContent("world");

      // Update to 3.5s
      rerender(
        <Transcription currentTime={3.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // Fourth segment should now be active
      activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toHaveTextContent("AI");
    });

    it("handles click-to-seek interaction", async () => {
      const user = userEvent.setup();
      const onSeek = vi.fn();

      render(
        <Transcription currentTime={0} onSeek={onSeek} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      // Click each segment and verify correct time is seeked
      await user.click(screen.getByText("Hello"));
      expect(onSeek).toHaveBeenLastCalledWith(0);

      await user.click(screen.getByText("world"));
      expect(onSeek).toHaveBeenLastCalledWith(1);

      await user.click(screen.getByText("from"));
      expect(onSeek).toHaveBeenLastCalledWith(2);

      await user.click(screen.getByText("AI"));
      expect(onSeek).toHaveBeenLastCalledWith(3);

      expect(onSeek).toHaveBeenCalledTimes(4);
    });

    it("works with audio element integration", async () => {
      const user = userEvent.setup();
      const audioRef = { current: { currentTime: 0 } };
      const onSeek = vi.fn((time) => {
        audioRef.current.currentTime = time;
      });

      render(
        <Transcription
          currentTime={audioRef.current.currentTime}
          onSeek={onSeek}
          segments={mockSegments}
        >
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      await user.click(screen.getByText("from"));

      expect(onSeek).toHaveBeenCalledWith(2);
      expect(audioRef.current.currentTime).toBe(2);
    });

    it("handles keyboard navigation", async () => {
      const user = userEvent.setup();
      const onSeek = vi.fn();

      render(
        <Transcription onSeek={onSeek} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const firstSegment = screen.getByText("Hello");
      firstSegment.focus();

      await user.keyboard("{Enter}");
      expect(onSeek).toHaveBeenCalledWith(0);

      await user.keyboard("{Space}");
      expect(onSeek).toHaveBeenCalledWith(0);
    });

    it("renders custom segment layout", () => {
      render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <div key={index}>
              <span data-testid={`time-${index}`}>{segment.startSecond}s</span>
              <span data-testid={`text-${index}`}>{segment.text}</span>
            </div>
          )}
        </Transcription>
      );

      expect(screen.getByTestId("time-0")).toHaveTextContent("0s");
      expect(screen.getByTestId("text-0")).toHaveTextContent("Hello");
      expect(screen.getByTestId("time-1")).toHaveTextContent("1s");
      expect(screen.getByTestId("text-1")).toHaveTextContent("world");
    });

    it("handles empty segments array", () => {
      const { container } = render(
        <Transcription segments={[]}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const transcription = container.querySelector(
        '[data-slot="transcription"]'
      );
      expect(transcription).toBeInTheDocument();
      expect(transcription?.children.length).toBe(0);
    });

    it("works in uncontrolled mode", () => {
      const { container } = render(
        <Transcription segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toHaveTextContent("Hello"); // Default 0
    });

    it("works in controlled mode", () => {
      const { container } = render(
        <Transcription currentTime={2.5} segments={mockSegments}>
          {(segment, index) => (
            <TranscriptionSegment
              index={index}
              key={`${segment.startSecond}-${segment.endSecond}`}
              segment={segment}
            />
          )}
        </Transcription>
      );

      const activeSegment = container.querySelector('[data-active="true"]');
      expect(activeSegment).toHaveTextContent("from"); // Controlled 2.5s
    });
  });
});
