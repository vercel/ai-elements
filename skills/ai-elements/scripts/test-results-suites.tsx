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
} from "@/components/ai-elements/test-results";

const Example = () => (
  <TestResults
    summary={{
      duration: 150,
      failed: 0,
      passed: 3,
      skipped: 0,
      total: 3,
    }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
    </TestResultsHeader>
    <TestResultsContent>
      <TestSuite name="Auth" status="passed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test duration={45} name="should login" status="passed" />
          <Test duration={32} name="should logout" status="passed" />
          <Test duration={73} name="should refresh token" status="passed" />
        </TestSuiteContent>
      </TestSuite>
    </TestResultsContent>
  </TestResults>
);

export default Example;
