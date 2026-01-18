"use client";

import {
  Test,
  TestResults,
  TestResultsContent,
  TestResultsHeader,
  TestResultsSummary,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from "@repo/elements/test-results";

const Example = () => (
  <TestResults
    summary={{
      passed: 3,
      failed: 0,
      skipped: 0,
      total: 3,
      duration: 150,
    }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
    </TestResultsHeader>
    <TestResultsContent>
      <TestSuite name="Auth" status="passed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test name="should login" status="passed" duration={45} />
          <Test name="should logout" status="passed" duration={32} />
          <Test name="should refresh token" status="passed" duration={73} />
        </TestSuiteContent>
      </TestSuite>
    </TestResultsContent>
  </TestResults>
);

export default Example;
