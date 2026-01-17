import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemAttachment,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemImage,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "../src/queue";

describe("Queue", () => {
  it("renders queue container", () => {
    const { container } = render(<Queue>Content</Queue>);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Queue className="custom-class">Content</Queue>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("QueueItem", () => {
  it("renders list item", () => {
    render(
      <ul>
        <QueueItem>Item content</QueueItem>
      </ul>
    );
    expect(screen.getByText("Item content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ul>
        <QueueItem className="custom-item">Item</QueueItem>
      </ul>
    );
    expect(container.querySelector("li")).toHaveClass("custom-item");
  });
});

describe("QueueItemIndicator", () => {
  it("renders indicator", () => {
    const { container } = render(<QueueItemIndicator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders completed state", () => {
    const { container } = render(<QueueItemIndicator completed />);
    expect(container.firstChild).toHaveClass("border-muted-foreground/20");
  });

  it("renders pending state", () => {
    const { container } = render(<QueueItemIndicator completed={false} />);
    expect(container.firstChild).toHaveClass("border-muted-foreground/50");
  });
});

describe("QueueItemContent", () => {
  it("renders content text", () => {
    render(<QueueItemContent>Task content</QueueItemContent>);
    expect(screen.getByText("Task content")).toBeInTheDocument();
  });

  it("applies completed styling", () => {
    const { container } = render(
      <QueueItemContent completed>Done</QueueItemContent>
    );
    expect(container.firstChild).toHaveClass("line-through");
    expect(container.firstChild).toHaveClass("text-muted-foreground/50");
  });

  it("applies pending styling", () => {
    const { container } = render(
      <QueueItemContent completed={false}>Pending</QueueItemContent>
    );
    expect(container.firstChild).toHaveClass("text-muted-foreground");
    expect(container.firstChild).not.toHaveClass("line-through");
  });
});

describe("QueueItemDescription", () => {
  it("renders description", () => {
    render(<QueueItemDescription>Description text</QueueItemDescription>);
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("applies completed styling", () => {
    const { container } = render(
      <QueueItemDescription completed>Done description</QueueItemDescription>
    );
    expect(container.firstChild).toHaveClass("line-through");
    expect(container.firstChild).toHaveClass("text-muted-foreground/40");
  });
});

describe("QueueItemActions", () => {
  it("renders actions container", () => {
    render(<QueueItemActions>Actions</QueueItemActions>);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});

describe("QueueItemAction", () => {
  it("renders action button", () => {
    render(<QueueItemAction>Click me</QueueItemAction>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("calls onClick handler", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<QueueItemAction onClick={handleClick}>Action</QueueItemAction>);

    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("QueueItemAttachment", () => {
  it("renders attachment container", () => {
    render(<QueueItemAttachment>Attachments</QueueItemAttachment>);
    expect(screen.getByText("Attachments")).toBeInTheDocument();
  });
});

describe("QueueItemImage", () => {
  it("renders image", () => {
    render(<QueueItemImage alt="Test image" src="test.jpg" />);
    const img = screen.getByAltText("Test image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test.jpg");
  });

  it("has correct dimensions", () => {
    const { container } = render(<QueueItemImage src="test.jpg" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("height", "32");
    expect(img).toHaveAttribute("width", "32");
  });
});

describe("QueueItemFile", () => {
  it("renders file name", () => {
    render(<QueueItemFile>document.pdf</QueueItemFile>);
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });
});

describe("QueueList", () => {
  it("renders list container", () => {
    render(
      <QueueList>
        <li>Item 1</li>
        <li>Item 2</li>
      </QueueList>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});

describe("QueueSection", () => {
  it("renders collapsible section", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>Section</QueueSectionTrigger>
        <QueueSectionContent>Content</QueueSectionContent>
      </QueueSection>
    );
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("opens by default", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>Section</QueueSectionTrigger>
        <QueueSectionContent>Content</QueueSectionContent>
      </QueueSection>
    );
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("can be collapsed", async () => {
    const user = userEvent.setup();

    render(
      <QueueSection>
        <QueueSectionTrigger>Section</QueueSectionTrigger>
        <QueueSectionContent>Content</QueueSectionContent>
      </QueueSection>
    );

    const trigger = screen.getByRole("button", { name: "Section" });
    const content = screen.getByText("Content");

    expect(content).toBeVisible();

    await user.click(trigger);

    // After collapse, the element should still exist but may not be visible due to animation
    await vi.waitFor(() => {
      const contentAfterCollapse = screen.queryByText("Content");
      // Check if it's either not in the document or has been hidden
      expect(
        contentAfterCollapse === null || !contentAfterCollapse.offsetParent
      ).toBe(true);
    });
  });
});

describe("QueueSectionTrigger", () => {
  it("renders trigger button", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>Trigger text</QueueSectionTrigger>
        <QueueSectionContent>Content</QueueSectionContent>
      </QueueSection>
    );
    expect(
      screen.getByRole("button", { name: "Trigger text" })
    ).toBeInTheDocument();
  });
});

describe("QueueSectionLabel", () => {
  it("renders label with count", () => {
    render(<QueueSectionLabel count={5} label="tasks" />);
    expect(screen.getByText("5 tasks")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    render(
      <QueueSectionLabel count={3} icon={<span>🔥</span>} label="items" />
    );
    expect(screen.getByText("🔥")).toBeInTheDocument();
    expect(screen.getByText("3 items")).toBeInTheDocument();
  });
});

describe("QueueSectionContent", () => {
  it("renders content", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>Section</QueueSectionTrigger>
        <QueueSectionContent>Section content</QueueSectionContent>
      </QueueSection>
    );
    expect(screen.getByText("Section content")).toBeInTheDocument();
  });
});

describe("Queue integration", () => {
  it("renders complete queue structure", () => {
    render(
      <Queue>
        <QueueSection>
          <QueueSectionTrigger>
            <QueueSectionLabel count={2} label="pending tasks" />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              <QueueItem>
                <div className="flex items-start gap-2">
                  <QueueItemIndicator />
                  <QueueItemContent>Task 1</QueueItemContent>
                </div>
                <QueueItemDescription>Description 1</QueueItemDescription>
              </QueueItem>
              <QueueItem>
                <div className="flex items-start gap-2">
                  <QueueItemIndicator completed />
                  <QueueItemContent completed>Task 2</QueueItemContent>
                </div>
              </QueueItem>
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>
    );

    expect(screen.getByText("2 pending tasks")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  it("renders queue with attachments", () => {
    render(
      <Queue>
        <QueueList>
          <QueueItem>
            <QueueItemContent>Message with files</QueueItemContent>
            <QueueItemAttachment>
              <QueueItemImage alt="preview" src="image.jpg" />
              <QueueItemFile>document.pdf</QueueItemFile>
            </QueueItemAttachment>
          </QueueItem>
        </QueueList>
      </Queue>
    );

    expect(screen.getByText("Message with files")).toBeInTheDocument();
    expect(screen.getByAltText("preview")).toBeInTheDocument();
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("renders queue with actions", () => {
    const handleDelete = vi.fn();
    const handleEdit = vi.fn();

    render(
      <Queue>
        <QueueList>
          <QueueItem>
            <QueueItemContent>Task with actions</QueueItemContent>
            <QueueItemActions>
              <QueueItemAction onClick={handleEdit}>Edit</QueueItemAction>
              <QueueItemAction onClick={handleDelete}>Delete</QueueItemAction>
            </QueueItemActions>
          </QueueItem>
        </QueueList>
      </Queue>
    );

    expect(screen.getByText("Task with actions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });
});
