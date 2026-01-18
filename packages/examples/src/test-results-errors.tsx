"use client";

import {
  Test,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestResults,
  TestResultsContent,
  TestResultsHeader,
  TestResultsSummary,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from "@repo/elements/test-results";

const stackTrace = `    at Object.<anonymous> (/app/src/api.test.ts:45:12)
    at Module._compile (node:internal/modules/cjs/loader:1369:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1427:10)`;

const Example = () => (
  <TestResults
    summary={{
      passed: 1,
      failed: 1,
      skipped: 0,
      total: 2,
      duration: 130,
    }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
    </TestResultsHeader>
    <TestResultsContent>
      <TestSuite name="API" status="failed" defaultOpen>
        <TestSuiteName />
        <TestSuiteContent>
          <Test name="should fetch data" status="passed" duration={45} />
          <Test name="should update" status="failed" duration={85}>
            <TestError>
              <TestErrorMessage>Expected 200, got 500</TestErrorMessage>
              <TestErrorStack>{stackTrace}</TestErrorStack>
            </TestError>
          </Test>
        </TestSuiteContent>
      </TestSuite>
    </TestResultsContent>
  </TestResults>
);

export default Example;
