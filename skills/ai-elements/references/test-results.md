# Test Results

Display test suite results with pass/fail/skip status and error details.

The `TestResults` component displays test suite results including summary statistics, progress, individual tests, and error details.

See `scripts/test-results.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add test-results
```

## Features

- Summary statistics (passed/failed/skipped)
- Progress bar visualization
- Collapsible test suites
- Individual test status and duration
- Error messages with stack traces
- Color-coded status indicators

## Status Colors

| Status    | Color           | Use Case         |
| --------- | --------------- | ---------------- |
| `passed`  | Green           | Test succeeded   |
| `failed`  | Red             | Test failed      |
| `skipped` | Yellow          | Test skipped     |
| `running` | Blue (animated) | Test in progress |

## Examples

### Basic Usage

See `scripts/test-results-basic.tsx` for this example.

### With Test Suites

See `scripts/test-results-suites.tsx` for this example.

### With Error Details

See `scripts/test-results-errors.tsx` for this example.

## Props

### `<TestResults />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `summary` | `unknown` | - | Test results summary. |
| `className` | `string` | - | Additional CSS classes. |

### `<TestSuite />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Suite name. |
| `status` | `unknown` | - | Overall suite status. |
| `defaultOpen` | `boolean` | - | Initially expanded. |

### `<Test />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Test name. |
| `status` | `unknown` | - | Test status. |
| `duration` | `number` | - | Test duration in ms. |

### `<TestResultsHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TestResultsSummary />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TestResultsDuration />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Any other props are spread to the span element. |

### `<TestResultsProgress />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TestResultsContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TestSuiteName />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CollapsibleTrigger>` | - | Any other props are spread to the CollapsibleTrigger component. |

### `<TestSuiteStats />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `passed` | `number` | `0` | Number of passed tests. |
| `failed` | `number` | `0` | Number of failed tests. |
| `skipped` | `number` | `0` | Number of skipped tests. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TestSuiteContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CollapsibleContent>` | - | Any other props are spread to the CollapsibleContent component. |

### `<TestStatus />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Any other props are spread to the span element. |

### `<TestName />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Any other props are spread to the span element. |

### `<TestDuration />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Any other props are spread to the span element. |

### `<TestError />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TestErrorMessage />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLParagraphElement>` | - | Any other props are spread to the p element. |

### `<TestErrorStack />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLPreElement>` | - | Any other props are spread to the pre element. |
