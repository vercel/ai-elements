import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from "../src/task";

describe("Task", () => {
  it("renders children", () => {
    render(<Task>Content</Task>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("is open by default", () => {
    render(
      <Task>
        <TaskTrigger title="Task" />
        <TaskContent>Task details</TaskContent>
      </Task>
    );
    expect(screen.getByText("Task details")).toBeVisible();
  });

  it("can start closed", () => {
    render(
      <Task defaultOpen={false}>
        <TaskTrigger title="Task" />
        <TaskContent>Hidden content</TaskContent>
      </Task>
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });
});

describe("TaskTrigger", () => {
  it("renders title", () => {
    render(
      <Task>
        <TaskTrigger title="Search task" />
      </Task>
    );
    expect(screen.getByText("Search task")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Task>
        <TaskTrigger title="Task">
          <div>Custom trigger</div>
        </TaskTrigger>
      </Task>
    );
    expect(screen.getByText("Custom trigger")).toBeInTheDocument();
  });

  it("has search icon by default", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="Task" />
      </Task>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();

    render(
      <Task defaultOpen={false}>
        <TaskTrigger title="Task" />
        <TaskContent>Content</TaskContent>
      </Task>
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    await user.click(screen.getByText("Task"));

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("TaskContent", () => {
  it("renders content", () => {
    render(
      <Task>
        <TaskTrigger title="Task" />
        <TaskContent>Task details</TaskContent>
      </Task>
    );
    expect(screen.getByText("Task details")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="Task" />
        <TaskContent className="custom">Content</TaskContent>
      </Task>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("TaskItem", () => {
  it("renders task item", () => {
    render(<TaskItem>Task item text</TaskItem>);
    expect(screen.getByText("Task item text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<TaskItem className="custom">Item</TaskItem>);
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("TaskItemFile", () => {
  it("renders file badge", () => {
    render(<TaskItemFile>file.txt</TaskItemFile>);
    expect(screen.getByText("file.txt")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <TaskItemFile className="custom">file.txt</TaskItemFile>
    );
    expect(container.firstChild).toHaveClass("custom");
  });
});
