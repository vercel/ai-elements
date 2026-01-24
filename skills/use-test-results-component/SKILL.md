---
name: Using the TestResults component from AI Elements
description: How to use the TestResults component to display test suite results with pass/fail status.
---

# TestResults Component

A comprehensive component for displaying test suite results with collapsible test suites, individual test statuses, error details, and progress visualization.

## Import

```tsx
import {
  TestResults,
  TestResultsHeader,
  TestResultsSummary,
  TestResultsDuration,
  TestResultsProgress,
  TestResultsContent,
  TestSuite,
  TestSuiteName,
  TestSuiteStats,
  TestSuiteContent,
  Test,
  TestStatus,
  TestName,
  TestDuration,
  TestError,
  TestErrorMessage,
  TestErrorStack,
} from "@repo/elements/test-results";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `TestResults` | Root container with summary context |
| `TestResultsHeader` | Header with summary and duration |
| `TestResultsSummary` | Pass/fail/skip badges |
| `TestResultsDuration` | Total test duration |
| `TestResultsProgress` | Visual progress bar |
| `TestResultsContent` | Container for test suites |
| `TestSuite` | Collapsible test suite group |
| `TestSuiteName` | Suite name with status icon |
| `TestSuiteStats` | Suite-level pass/fail counts |
| `TestSuiteContent` | Container for individual tests |
| `Test` | Individual test result row |
| `TestStatus` | Test status icon |
| `TestName` | Test name text |
| `TestDuration` | Test execution time |
| `TestError` | Error details container |
| `TestErrorMessage` | Error message text |
| `TestErrorStack` | Stack trace pre-formatted text |

## Basic Usage

```tsx
const Example = () => (
  <TestResults
    summary={{
      passed: 10,
      failed: 2,
      skipped: 1,
      total: 13,
      duration: 3500,
    }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
      <TestResultsDuration />
    </TestResultsHeader>
  </TestResults>
);
```

## Full Example with Suites

```tsx
const Example = () => (
  <TestResults
    summary={{ passed: 12, failed: 2, skipped: 1, total: 15, duration: 3245 }}
  >
    <TestResultsHeader>
      <TestResultsSummary />
      <TestResultsDuration />
    </TestResultsHeader>
    <div className="border-b px-4 py-3">
      <TestResultsProgress />
    </div>
    <TestResultsContent>
      <TestSuite defaultOpen name="Authentication" status="passed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test duration={45} name="should login with valid credentials" status="passed" />
          <Test duration={32} name="should reject invalid password" status="passed" />
        </TestSuiteContent>
      </TestSuite>

      <TestSuite defaultOpen name="User API" status="failed">
        <TestSuiteName />
        <TestSuiteContent>
          <Test duration={120} name="should create new user" status="passed" />
          <Test duration={85} name="should update user profile" status="failed">
            <TestError>
              <TestErrorMessage>Expected status 200 but received 500</TestErrorMessage>
              <TestErrorStack>
                {`  at Object.<anonymous> (src/user.test.ts:45:12)`}
              </TestErrorStack>
            </TestError>
          </Test>
        </TestSuiteContent>
      </TestSuite>
    </TestResultsContent>
  </TestResults>
);
```

## Props Reference

### `<TestResults />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `summary` | `{ passed: number; failed: number; skipped: number; total: number; duration?: number }` | - | Test results summary |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Content (auto-renders header if summary provided) |

### `<TestSuite />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Suite name |
| `status` | `"passed" \| "failed" \| "skipped" \| "running"` | Required | Suite status |
| `defaultOpen` | `boolean` | - | Initial collapsed state |
| `className` | `string` | - | Additional CSS classes |

### `<Test />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Test name |
| `status` | `"passed" \| "failed" \| "skipped" \| "running"` | Required | Test status |
| `duration` | `number` | - | Test duration in milliseconds |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Error details (TestError) |

### `<TestSuiteStats />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `passed` | `number` | `0` | Number of passed tests |
| `failed` | `number` | `0` | Number of failed tests |
| `skipped` | `number` | `0` | Number of skipped tests |

## Examples

See `scripts/` folder for complete working examples.
