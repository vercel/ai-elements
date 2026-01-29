import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange,
} from "../src/audio-player";

// Mock console methods
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("AudioPlayer", () => {
  it("renders as MediaController", () => {
    const { container } = render(
      <AudioPlayer>
        <div>Audio Content</div>
      </AudioPlayer>
    );
    expect(container.firstChild).toHaveAttribute("data-slot", "audio-player");
  });

  it("renders children", () => {
    render(
      <AudioPlayer>
        <div data-testid="audio-content">Audio Content</div>
      </AudioPlayer>
    );
    expect(screen.getByTestId("audio-content")).toBeInTheDocument();
  });

  it("accepts custom className prop", () => {
    const { container } = render(
      <AudioPlayer className="custom-player">
        <div>Content</div>
      </AudioPlayer>
    );
    const player = container.querySelector('[data-slot="audio-player"]');
    // Verify component renders with className prop accepted
    expect(player).toBeInTheDocument();
  });

  it("applies custom styles", () => {
    const customStyles = { "--custom-color": "red" } as React.CSSProperties;
    const { container } = render(
      <AudioPlayer style={customStyles}>
        <div>Content</div>
      </AudioPlayer>
    );
    const player = container.querySelector('[data-slot="audio-player"]');
    expect(player).toHaveAttribute("style");
  });

  it("sets audio attribute to true", () => {
    const { container } = render(
      <AudioPlayer>
        <div>Content</div>
      </AudioPlayer>
    );
    const player = container.querySelector('[data-slot="audio-player"]');
    expect(player).toHaveAttribute("audio");
  });
});

describe("AudioPlayerElement", () => {
  it("renders audio element with remote src", () => {
    const { container } = render(
      <AudioPlayerElement src="https://example.com/audio.mp3" />
    );
    const audio = container.querySelector('[data-slot="audio-player-element"]');
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute("src", "https://example.com/audio.mp3");
  });

  it("renders audio element with base64 data", () => {
    const mockData = {
      mediaType: "audio/mpeg",
      base64: "SGVsbG8gV29ybGQ=",
      format: "mp3" as const,
      uint8Array: new Uint8Array([72, 101, 108, 108, 111]),
    };

    const { container } = render(<AudioPlayerElement data={mockData} />);
    const audio = container.querySelector('[data-slot="audio-player-element"]');
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute(
      "src",
      "data:audio/mpeg;base64,SGVsbG8gV29ybGQ="
    );
  });

  it("has slot attribute set to media", () => {
    const { container } = render(
      <AudioPlayerElement src="https://example.com/audio.mp3" />
    );
    const audio = container.querySelector('[data-slot="audio-player-element"]');
    expect(audio).toHaveAttribute("slot", "media");
  });

  it("accepts additional audio props", () => {
    const { container } = render(
      <AudioPlayerElement autoPlay loop src="https://example.com/audio.mp3" />
    );
    const audio = container.querySelector('[data-slot="audio-player-element"]');
    expect(audio).toHaveAttribute("autoplay");
    expect(audio).toHaveAttribute("loop");
  });
});

describe("AudioPlayerControlBar", () => {
  it("renders control bar with ButtonGroup", () => {
    const { container } = render(
      <AudioPlayerControlBar>
        <div data-testid="controls">Controls</div>
      </AudioPlayerControlBar>
    );
    const controlBar = container.querySelector(
      '[data-slot="audio-player-control-bar"]'
    );
    expect(controlBar).toBeInTheDocument();
    expect(screen.getByTestId("controls")).toBeInTheDocument();
  });

  it("renders children inside ButtonGroup", () => {
    render(
      <AudioPlayerControlBar>
        <button type="button">Control 1</button>
        <button type="button">Control 2</button>
      </AudioPlayerControlBar>
    );
    expect(screen.getByText("Control 1")).toBeInTheDocument();
    expect(screen.getByText("Control 2")).toBeInTheDocument();
  });
});

describe("AudioPlayerPlayButton", () => {
  it("renders play button", () => {
    const { container } = render(<AudioPlayerPlayButton />);
    const button = container.querySelector(
      '[data-slot="audio-player-play-button"]'
    );
    expect(button).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AudioPlayerPlayButton className="custom-play" />
    );
    const button = container.querySelector(
      '[data-slot="audio-player-play-button"]'
    );
    expect(button).toHaveClass("custom-play");
  });

  it("has transparent background", () => {
    const { container } = render(<AudioPlayerPlayButton />);
    const button = container.querySelector(
      '[data-slot="audio-player-play-button"]'
    );
    expect(button).toHaveClass("bg-transparent");
  });
});

describe("AudioPlayerSeekBackwardButton", () => {
  it("renders seek backward button", () => {
    const { container } = render(<AudioPlayerSeekBackwardButton />);
    const button = container.querySelector(
      '[data-slot="audio-player-seek-backward-button"]'
    );
    expect(button).toBeInTheDocument();
  });

  it("uses default seek offset of 10", () => {
    const { container } = render(<AudioPlayerSeekBackwardButton />);
    const button = container.querySelector(
      '[data-slot="audio-player-seek-backward-button"]'
    );
    expect(button).toHaveAttribute("seekoffset", "10");
  });

  it("accepts custom seek offset", () => {
    const { container } = render(
      <AudioPlayerSeekBackwardButton seekOffset={30} />
    );
    const button = container.querySelector(
      '[data-slot="audio-player-seek-backward-button"]'
    );
    expect(button).toHaveAttribute("seekoffset", "30");
  });
});

describe("AudioPlayerSeekForwardButton", () => {
  it("renders seek forward button", () => {
    const { container } = render(<AudioPlayerSeekForwardButton />);
    const button = container.querySelector(
      '[data-slot="audio-player-seek-forward-button"]'
    );
    expect(button).toBeInTheDocument();
  });

  it("uses default seek offset of 10", () => {
    const { container } = render(<AudioPlayerSeekForwardButton />);
    const button = container.querySelector(
      '[data-slot="audio-player-seek-forward-button"]'
    );
    expect(button).toHaveAttribute("seekoffset", "10");
  });

  it("accepts custom seek offset", () => {
    const { container } = render(
      <AudioPlayerSeekForwardButton seekOffset={15} />
    );
    const button = container.querySelector(
      '[data-slot="audio-player-seek-forward-button"]'
    );
    expect(button).toHaveAttribute("seekoffset", "15");
  });
});

describe("AudioPlayerTimeDisplay", () => {
  it("renders time display", () => {
    const { container } = render(<AudioPlayerTimeDisplay />);
    const display = container.querySelector(
      '[data-slot="audio-player-time-display"]'
    );
    expect(display).toBeInTheDocument();
  });

  it("has tabular-nums class", () => {
    const { container } = render(<AudioPlayerTimeDisplay />);
    const display = container.querySelector(
      '[data-slot="audio-player-time-display"]'
    );
    expect(display).toHaveClass("tabular-nums");
  });

  it("applies custom className", () => {
    const { container } = render(
      <AudioPlayerTimeDisplay className="custom-time" />
    );
    const display = container.querySelector(
      '[data-slot="audio-player-time-display"]'
    );
    expect(display).toHaveClass("custom-time");
  });
});

describe("AudioPlayerTimeRange", () => {
  it("renders time range slider", () => {
    const { container } = render(<AudioPlayerTimeRange />);
    const range = container.querySelector(
      '[data-slot="audio-player-time-range"]'
    );
    expect(range).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AudioPlayerTimeRange className="custom-range" />
    );
    const range = container.querySelector(
      '[data-slot="audio-player-time-range"]'
    );
    expect(range).toHaveClass("custom-range");
  });
});

describe("AudioPlayerDurationDisplay", () => {
  it("renders duration display", () => {
    const { container } = render(<AudioPlayerDurationDisplay />);
    const display = container.querySelector(
      '[data-slot="audio-player-duration-display"]'
    );
    expect(display).toBeInTheDocument();
  });

  it("has tabular-nums class", () => {
    const { container } = render(<AudioPlayerDurationDisplay />);
    const display = container.querySelector(
      '[data-slot="audio-player-duration-display"]'
    );
    expect(display).toHaveClass("tabular-nums");
  });

  it("applies custom className", () => {
    const { container } = render(
      <AudioPlayerDurationDisplay className="custom-duration" />
    );
    const display = container.querySelector(
      '[data-slot="audio-player-duration-display"]'
    );
    expect(display).toHaveClass("custom-duration");
  });
});

describe("AudioPlayerMuteButton", () => {
  it("renders mute button", () => {
    const { container } = render(<AudioPlayerMuteButton />);
    const button = container.querySelector(
      '[data-slot="audio-player-mute-button"]'
    );
    expect(button).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AudioPlayerMuteButton className="custom-mute" />
    );
    const button = container.querySelector(
      '[data-slot="audio-player-mute-button"]'
    );
    expect(button).toHaveClass("custom-mute");
  });
});

describe("AudioPlayerVolumeRange", () => {
  it("renders volume range slider", () => {
    const { container } = render(<AudioPlayerVolumeRange />);
    const range = container.querySelector(
      '[data-slot="audio-player-volume-range"]'
    );
    expect(range).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AudioPlayerVolumeRange className="custom-volume" />
    );
    const range = container.querySelector(
      '[data-slot="audio-player-volume-range"]'
    );
    expect(range).toHaveClass("custom-volume");
  });
});

describe("Integration tests", () => {
  it("renders complete audio player with all controls", () => {
    const { container } = render(
      <AudioPlayer>
        <AudioPlayerElement src="https://example.com/audio.mp3" />
        <AudioPlayerControlBar>
          <AudioPlayerPlayButton />
          <AudioPlayerSeekBackwardButton seekOffset={10} />
          <AudioPlayerSeekForwardButton seekOffset={10} />
          <AudioPlayerTimeDisplay />
          <AudioPlayerTimeRange />
          <AudioPlayerDurationDisplay />
          <AudioPlayerMuteButton />
          <AudioPlayerVolumeRange />
        </AudioPlayerControlBar>
      </AudioPlayer>
    );

    expect(
      container.querySelector('[data-slot="audio-player"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-element"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-control-bar"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-play-button"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-seek-backward-button"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-seek-forward-button"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-time-display"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-time-range"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-duration-display"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-mute-button"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="audio-player-volume-range"]')
    ).toBeInTheDocument();
  });

  it("handles AI SDK speech result data format", () => {
    const mockSpeechData = {
      mediaType: "audio/mpeg",
      base64: "dGVzdA==",
      format: "mp3" as const,
      uint8Array: new Uint8Array([116, 101, 115, 116]),
    };

    const { container } = render(
      <AudioPlayer>
        <AudioPlayerElement data={mockSpeechData} />
        <AudioPlayerControlBar>
          <AudioPlayerPlayButton />
        </AudioPlayerControlBar>
      </AudioPlayer>
    );

    const audio = container.querySelector('[data-slot="audio-player-element"]');
    expect(audio).toHaveAttribute("src", "data:audio/mpeg;base64,dGVzdA==");
  });

  it("handles remote audio URL format", () => {
    const { container } = render(
      <AudioPlayer>
        <AudioPlayerElement src="https://example.com/audio.mp3" />
        <AudioPlayerControlBar>
          <AudioPlayerPlayButton />
        </AudioPlayerControlBar>
      </AudioPlayer>
    );

    const audio = container.querySelector('[data-slot="audio-player-element"]');
    expect(audio).toHaveAttribute("src", "https://example.com/audio.mp3");
  });
});
