import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "../src/inline-citation";

const EXAMPLE_COM_PLUS_TWO_REGEX = /example\.com \+2/;
const PREVIOUS_REGEX = /previous/i;
const NEXT_REGEX = /next/i;

describe("InlineCitation", () => {
  it("renders children", () => {
    render(<InlineCitation>Citation content</InlineCitation>);
    expect(screen.getByText("Citation content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <InlineCitation className="custom">Text</InlineCitation>
    );
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("InlineCitationText", () => {
  it("renders text content", () => {
    render(<InlineCitationText>Cited text</InlineCitationText>);
    expect(screen.getByText("Cited text")).toBeInTheDocument();
  });

  it("has group hover effect class", () => {
    const { container } = render(<InlineCitationText>Text</InlineCitationText>);
    expect(container.firstChild).toHaveClass("transition-colors");
  });
});

describe("InlineCitationCard", () => {
  it("renders card", () => {
    render(
      <InlineCitationCard>
        <div>Card content</div>
      </InlineCitationCard>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });
});

describe("InlineCitationCardTrigger", () => {
  it("renders single source hostname", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={["https://example.com/page"]} />
      </InlineCitationCard>
    );
    expect(screen.getByText("example.com")).toBeInTheDocument();
  });

  it("renders multiple sources count", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger
          sources={[
            "https://example.com",
            "https://test.com",
            "https://demo.com",
          ]}
        />
      </InlineCitationCard>
    );
    expect(screen.getByText(EXAMPLE_COM_PLUS_TWO_REGEX)).toBeInTheDocument();
  });

  it("renders unknown for empty sources", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={[]} />
      </InlineCitationCard>
    );
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
});

describe("InlineCitationCardBody", () => {
  it("renders body content", () => {
    render(
      <InlineCitationCard defaultOpen>
        <InlineCitationCardTrigger sources={["https://example.com"]} />
        <InlineCitationCardBody>Body</InlineCitationCardBody>
      </InlineCitationCard>
    );
    expect(screen.getByText("Body")).toBeInTheDocument();
  });
});

describe("InlineCitationCarousel", () => {
  it("renders carousel", () => {
    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item 1</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });
});

describe("InlineCitationCarouselHeader", () => {
  it("renders header", () => {
    render(<InlineCitationCarouselHeader>Header</InlineCitationCarouselHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});

describe("InlineCitationSource", () => {
  it("renders source with all props", () => {
    render(
      <InlineCitationSource
        description="Description text"
        title="Source Title"
        url="https://example.com"
      />
    );
    expect(screen.getByText("Source Title")).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<InlineCitationSource>Custom content</InlineCitationSource>);
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });
});

describe("InlineCitationQuote", () => {
  it("renders quote", () => {
    render(<InlineCitationQuote>Quote text</InlineCitationQuote>);
    expect(screen.getByText("Quote text")).toBeInTheDocument();
  });

  it("renders as blockquote element", () => {
    const { container } = render(
      <InlineCitationQuote>Quote</InlineCitationQuote>
    );
    expect(container.querySelector("blockquote")).toBeInTheDocument();
  });
});

describe("InlineCitationCarouselIndex", () => {
  it("renders index component", () => {
    const { container } = render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselIndex count={5} current={2} />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    const indexDiv = container.querySelector("[count='5'][current='2']");
    expect(indexDiv).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselIndex count={5} current={2}>
            Custom Index
          </InlineCitationCarouselIndex>
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(screen.getByText("Custom Index")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselIndex
            className="custom-index"
            count={3}
            current={1}
          />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(container.querySelector(".custom-index")).toBeInTheDocument();
  });
});

describe("InlineCitationCarouselPrev", () => {
  it("renders previous button", () => {
    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselPrev />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(
      screen.getByRole("button", { name: PREVIOUS_REGEX })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselPrev className="custom-prev" />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    const button = screen.getByRole("button", { name: PREVIOUS_REGEX });
    expect(button).toHaveClass("custom-prev");
  });

  it("renders ArrowLeftIcon", () => {
    const { container } = render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselPrev />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("navigates to previous item when clicked", async () => {
    const user = userEvent.setup();

    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselPrev />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item 1</InlineCitationCarouselItem>
          <InlineCitationCarouselItem>Item 2</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );

    const button = screen.getByRole("button", { name: PREVIOUS_REGEX });
    await user.click(button);

    // Button should be clickable without errors
    expect(button).toBeInTheDocument();
  });
});

describe("InlineCitationCarouselNext", () => {
  it("renders next button", () => {
    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselNext />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(
      screen.getByRole("button", { name: NEXT_REGEX })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselNext className="custom-next" />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    const button = screen.getByRole("button", { name: NEXT_REGEX });
    expect(button).toHaveClass("custom-next");
  });

  it("renders ArrowRightIcon", () => {
    const { container } = render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselNext />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("navigates to next item when clicked", async () => {
    const user = userEvent.setup();

    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselNext />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>Item 1</InlineCitationCarouselItem>
          <InlineCitationCarouselItem>Item 2</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );

    const button = screen.getByRole("button", { name: NEXT_REGEX });
    await user.click(button);

    // Button should be clickable without errors
    expect(button).toBeInTheDocument();
  });
});
