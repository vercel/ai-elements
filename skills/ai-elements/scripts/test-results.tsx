"use client";

import {
  Test,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsProgress,
  TestResultsSummary,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from "@/components/ai-elements/test-results";

const Example = () => (
  <TestResults
    summary={{
      duration: 3245,
      failed: 2,
      passed: 12,
      skipped: 1,
      total: 15,
    }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
      <TestResultsDuration />
    </TestResultsHeader>
    <div className="border-b px-4 py-3">
      <TestResultsProgress />
    </div>
    <TestResultsContent>
      <TestSuite defaultOpen={true} name="Authentication" status="passed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test
            duration={45}
            name="should login with valid credentials"
            status="passed"
          />
          <Test
            duration={32}
            name="should reject invalid password"
            status="passed"
          />
          <Test
            duration={28}
            name="should handle expired tokens"
            status="passed"
          />
        </TestSuiteContent>
      </TestSuite>

      <TestSuite defaultOpen={true} name="User API" status="failed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test duration={120} name="should create new user" status="passed" />
          <Test duration={85} name="should update user profile" status="failed">
            <TestError>
              <TestErrorMessage>
                Expected status 200 but received 500
              </TestErrorMessage>
              <TestErrorStack>
                {`  at Object.<anonymous> (src/user.test.ts:45:12)
  at Promise.then.completed (node_modules/jest-circus/build/utils.js:391:28)`}
              </TestErrorStack>
            </TestError>
          </Test>
          <Test name="should delete user" status="skipped" />
        </TestSuiteContent>
      </TestSuite>

      <TestSuite name="Database" status="failed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test
            duration={200}
            name="should connect to database"
            status="passed"
          />
          <Test
            duration={5000}
            name="should handle connection timeout"
            status="failed"
          >
            <TestError>
              <TestErrorMessage>
                Connection timed out after 5000ms
              </TestErrorMessage>
            </TestError>
          </Test>
        </TestSuiteContent>
      </TestSuite>
    </TestResultsContent>
  </TestResults>
);

export default Example;
