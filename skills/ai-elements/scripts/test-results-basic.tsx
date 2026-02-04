"use client";

import {
  TestResults,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsSummary,
} from "@/components/ai-elements/test-results";

const Example = () => (
  <TestResults
    summary={{
      duration: 3500,
      failed: 2,
      passed: 10,
      skipped: 1,
      total: 13,
    }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
      <TestResultsDuration />
    </TestResultsHeader>
  </TestResults>
);

export default Example;
