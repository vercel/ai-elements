import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Test,
  TestDuration,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestName,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsProgress,
  TestResultsSummary,
  TestStatus,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from "../src/test-results";

const PASSED_10_REGEX = /10 passed/;
const FAILED_2_REGEX = /2 failed/;
const SKIPPED_1_REGEX = /1 skipped/;
const PASSED_2_REGEX = /2 passed/;
const FAILED_1_REGEX = /1 failed/;

describe("TestResults", () => {
  it("renders with summary", () => {
    render(
      <TestResults
        summary={{
          passed: 10,
          failed: 2,
          skipped: 1,
          total: 13,
          duration: 5000,
        }}
      >
        <TestResultsHeader>
          <TestResultsSummary />
          <TestResultsDuration />
        </TestResultsHeader>
      </TestResults>
    );

    expect(screen.getByText(PASSED_10_REGEX)).toBeInTheDocument();
    expect(screen.getByText(FAILED_2_REGEX)).toBeInTheDocument();
    expect(screen.getByText(SKIPPED_1_REGEX)).toBeInTheDocument();
    expect(screen.getByText("5.00s")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <TestResults className="custom-class">
        <div>Content</div>
      </TestResults>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("TestResultsProgress", () => {
  it("renders progress bar", () => {
    render(
      <TestResults summary={{ passed: 8, failed: 2, skipped: 0, total: 10 }}>
        <TestResultsProgress />
      </TestResults>
    );

    expect(screen.getByText("8/10 tests passed")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });
});

describe("TestResultsDuration", () => {
  it("formats milliseconds", () => {
    render(
      <TestResults
        summary={{ passed: 1, failed: 0, skipped: 0, total: 1, duration: 500 }}
      >
        <TestResultsDuration />
      </TestResults>
    );
    expect(screen.getByText("500ms")).toBeInTheDocument();
  });

  it("formats seconds", () => {
    render(
      <TestResults
        summary={{ passed: 1, failed: 0, skipped: 0, total: 1, duration: 3500 }}
      >
        <TestResultsDuration />
      </TestResults>
    );
    expect(screen.getByText("3.50s")).toBeInTheDocument();
  });
});

describe("TestSuite", () => {
  it("renders suite name", () => {
    render(
      <TestResults>
        <TestResultsContent>
          <TestSuite name="Auth Tests" status="passed">
            <TestSuiteName />
          </TestSuite>
        </TestResultsContent>
      </TestResults>
    );
    expect(screen.getByText("Auth Tests")).toBeInTheDocument();
  });

  it("expands when clicked", async () => {
    const user = userEvent.setup();
    render(
      <TestResults>
        <TestResultsContent>
          <TestSuite name="Auth" status="passed">
            <TestSuiteName />
            <TestSuiteContent>
              <Test name="test 1" status="passed" />
            </TestSuiteContent>
          </TestSuite>
        </TestResultsContent>
      </TestResults>
    );

    expect(screen.queryByText("test 1")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByText("test 1")).toBeInTheDocument();
  });
});

describe("Test", () => {
  it("renders test name and status", () => {
    render(
      <TestResults>
        <TestResultsContent>
          <Test name="should work" status="passed" />
        </TestResultsContent>
      </TestResults>
    );
    expect(screen.getByText("should work")).toBeInTheDocument();
  });

  it("renders duration", () => {
    render(
      <TestResults>
        <TestResultsContent>
          <Test duration={42} name="test" status="passed" />
        </TestResultsContent>
      </TestResults>
    );
    expect(screen.getByText("42ms")).toBeInTheDocument();
  });

  it("renders passed status", () => {
    const { container } = render(
      <TestResults>
        <Test name="test" status="passed" />
      </TestResults>
    );
    expect(container.querySelector(".text-green-600")).toBeInTheDocument();
  });

  it("renders failed status", () => {
    const { container } = render(
      <TestResults>
        <Test name="test" status="failed" />
      </TestResults>
    );
    expect(container.querySelector(".text-red-600")).toBeInTheDocument();
  });

  it("renders skipped status", () => {
    const { container } = render(
      <TestResults>
        <Test name="test" status="skipped" />
      </TestResults>
    );
    expect(container.querySelector(".text-yellow-600")).toBeInTheDocument();
  });

  it("renders running status", () => {
    const { container } = render(
      <TestResults>
        <Test name="test" status="running" />
      </TestResults>
    );
    expect(container.querySelector(".text-blue-600")).toBeInTheDocument();
  });
});

describe("TestError", () => {
  it("renders error message", () => {
    render(
      <TestResults>
        <TestError>
          <TestErrorMessage>Something went wrong</TestErrorMessage>
        </TestError>
      </TestResults>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders error stack", () => {
    render(
      <TestResults>
        <TestError>
          <TestErrorStack>at test.js:10</TestErrorStack>
        </TestError>
      </TestResults>
    );
    expect(screen.getByText("at test.js:10")).toBeInTheDocument();
  });
});

describe("Composability", () => {
  it("renders full test results structure", () => {
    render(
      <TestResults
        summary={{ passed: 2, failed: 1, skipped: 0, total: 3, duration: 1000 }}
      >
        <TestResultsHeader>
          <TestResultsSummary />
          <TestResultsDuration />
        </TestResultsHeader>
        <TestResultsContent>
          <TestSuite defaultOpen={true} name="Suite" status="failed">
            <TestSuiteName />
            <TestSuiteContent>
              <Test duration={10} name="test 1" status="passed">
                <TestStatus />
                <TestName />
                <TestDuration />
              </Test>
              <Test duration={20} name="test 2" status="failed">
                <TestStatus />
                <TestName />
                <TestDuration />
                <TestError>
                  <TestErrorMessage>Error!</TestErrorMessage>
                </TestError>
              </Test>
            </TestSuiteContent>
          </TestSuite>
        </TestResultsContent>
      </TestResults>
    );

    expect(screen.getByText(PASSED_2_REGEX)).toBeInTheDocument();
    expect(screen.getByText(FAILED_1_REGEX)).toBeInTheDocument();
    expect(screen.getByText("1.00s")).toBeInTheDocument();
    expect(screen.getByText("Suite")).toBeInTheDocument();
    expect(screen.getByText("test 1")).toBeInTheDocument();
    expect(screen.getByText("test 2")).toBeInTheDocument();
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });
});
