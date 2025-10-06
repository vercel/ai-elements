import { render, screen } from "@testing-library/react";
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
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "../src/inline-citation";

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
    expect(screen.getByText(/example\.com \+2/)).toBeInTheDocument();
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
