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
