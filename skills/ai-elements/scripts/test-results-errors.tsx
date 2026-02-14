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
} from "@/components/ai-elements/test-results";

const stackTrace = `    at Object.<anonymous> (/app/src/api.test.ts:45:12)
    at Module._compile (node:internal/modules/cjs/loader:1369:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1427:10)`;

const Example = () => (
  <TestResults
    summary={{
      duration: 130,
      failed: 1,
      passed: 1,
      skipped: 0,
      total: 2,
    }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
    </TestResultsHeader>
    <TestResultsContent>
      <TestSuite defaultOpen name="API" status="failed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test duration={45} name="should fetch data" status="passed" />
          <Test duration={85} name="should update" status="failed">
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
