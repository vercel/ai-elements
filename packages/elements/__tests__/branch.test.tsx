import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Branch,
  BranchMessages,
  BranchNext,
  BranchPage,
  BranchPrevious,
  BranchSelector,
} from "../src/branch";

describe("Branch", () => {
  it("renders children", () => {
    render(<Branch>Content</Branch>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("throws error when components used outside Branch provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<BranchNext />)).toThrow(
      "Branch components must be used within Branch"
    );

    spy.mockRestore();
  });

  it("calls onBranchChange when branch changes", async () => {
    const onBranchChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Branch onBranchChange={onBranchChange}>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </BranchMessages>
        <BranchSelector from="assistant">
          <BranchPrevious />
          <BranchNext />
        </BranchSelector>
      </Branch>
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(onBranchChange).toHaveBeenCalledWith(1);
  });
});

describe("BranchMessages", () => {
  it("renders active branch", () => {
    render(
      <Branch>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </BranchMessages>
      </Branch>
    );

    expect(screen.getByText("Branch 1")).toBeInTheDocument();
  });
});

describe("BranchSelector", () => {
  it("hides when only one branch", () => {
    const { container } = render(
      <Branch>
        <BranchMessages>
          <div key="1">Single Branch</div>
        </BranchMessages>
        <BranchSelector from="assistant">
          <span>Selector</span>
        </BranchSelector>
      </Branch>
    );

    expect(screen.queryByText("Selector")).not.toBeInTheDocument();
  });

  it("shows when multiple branches", () => {
    render(
      <Branch>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </BranchMessages>
        <BranchSelector from="assistant">
          <span>Selector</span>
        </BranchSelector>
      </Branch>
    );

    expect(screen.getByText("Selector")).toBeInTheDocument();
  });
});

describe("BranchPrevious", () => {
  it("renders previous button", () => {
    render(
      <Branch>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </BranchMessages>
        <BranchPrevious />
      </Branch>
    );

    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
  });

  it("navigates to previous branch", async () => {
    const user = userEvent.setup();

    render(
      <Branch defaultBranch={1}>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </BranchMessages>
        <BranchPrevious />
        <BranchPage />
      </Branch>
    );

    // Should start at branch 2
    expect(screen.getByText(/2 of 2/)).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /previous/i });
    await user.click(prevButton);

    // Should navigate to branch 1
    expect(screen.getByText(/1 of 2/)).toBeInTheDocument();
  });

  it("wraps to last branch when clicking previous on first branch", async () => {
    const user = userEvent.setup();

    render(
      <Branch defaultBranch={0}>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
          <div key="3">Branch 3</div>
        </BranchMessages>
        <BranchPrevious />
        <BranchPage />
      </Branch>
    );

    // Should start at branch 1
    expect(screen.getByText(/1 of 3/)).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /previous/i });
    await user.click(prevButton);

    // Should wrap to branch 3
    expect(screen.getByText(/3 of 3/)).toBeInTheDocument();
  });
});

describe("BranchNext", () => {
  it("renders next button", () => {
    render(
      <Branch>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </BranchMessages>
        <BranchNext />
      </Branch>
    );

    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});

describe("BranchPage", () => {
  it("displays current page count", () => {
    render(
      <Branch>
        <BranchMessages>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </BranchMessages>
        <BranchPage />
      </Branch>
    );

    expect(screen.getByText(/1 of 2/)).toBeInTheDocument();
  });
});
