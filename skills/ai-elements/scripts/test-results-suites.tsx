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
          <Test duration={45} name="should login" status="passed" />
          <Test duration={32} name="should logout" status="passed" />
          <Test duration={73} name="should refresh token" status="passed" />
        </TestSuiteContent>
      </TestSuite>
    </TestResultsContent>
  </TestResults>
);

export default Example;
