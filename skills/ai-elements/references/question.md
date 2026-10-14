# Question

A composable prompt for collecting choices, freeform text, or both from a user.

The `Question` component presents a human-in-the-loop question as an immediately actionable form. Use it when an AI workflow pauses for structured input instead of hiding the prompt inside a tool details view.

See `scripts/question.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add question
```

## Usage

```tsx
import {
  Question,
  QuestionActions,
  QuestionDescription,
  QuestionInput,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
} from "@/components/ai-elements/question";

<Question
  onSubmit={async ({ selectedValues, text }) => {
    await respondToQuestion({ selectedValues, text });
  }}
  selectionMode="multiple"
>
  <QuestionPrompt>What should the project include?</QuestionPrompt>
  <QuestionDescription>
    Choose any features and add details if needed.
  </QuestionDescription>
  <QuestionOptions aria-label="Project features">
    <QuestionOption value="authentication">Authentication</QuestionOption>
    <QuestionOption value="database">Database</QuestionOption>
    <QuestionOption value="payments">Payments</QuestionOption>
  </QuestionOptions>
  <QuestionInput
    aria-label="Additional requirements"
    placeholder="Add any other requirements…"
  />
  <QuestionActions>
    <QuestionSubmit>Answer</QuestionSubmit>
  </QuestionActions>
</Question>;
```

Render only the parts the question supports. `QuestionSubmit` remains disabled until the user selects an option or enters non-whitespace text. The component trims freeform text before calling `onSubmit`.

## Examples

### Single select

Leave `selectionMode` as `"single"` when the user should choose exactly one option. Options use radio semantics, and selecting a new option replaces the previous selection.

See `scripts/question-single-select.tsx` for this example.

### Multi-select

Set `selectionMode="multiple"` when the user may choose several options. Options use checkbox semantics, and `selectedValues` contains every selected value.

See `scripts/question-multi-select.tsx` for this example.

### Freeform

Render `QuestionInput` without `QuestionOptions` to collect a text-only answer.

See `scripts/question-freeform.tsx` for this example.

### Options and freeform

Render options and an input together when users may choose suggested answers and add context. The response can contain both `selectedValues` and `text`.

See `scripts/question.tsx` for this example.

## Controlled state

Use `value` and `onValueChange` when another part of your application owns the draft response:

```tsx
const [value, setValue] = useState({ selectedValues: [], text: "" });

<Question value={value} onValueChange={setValue} onSubmit={handleSubmit}>
  {/* question content */}
</Question>;
```

## Props

### `<Question />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `QuestionValue` | - | The controlled question draft. |
| `defaultValue` | `QuestionValue` | `{ selectedValues: [], text: "" }` | The initial question draft when the component is uncontrolled. |
| `selectionMode` | `"single" \| "multiple"` | `"single"` | Whether options behave as a single-choice radio group or multiple-choice checkboxes. |
| `disabled` | `boolean` | `false` | Disables the input, options, and submit action. |
| `onValueChange` | `(value: QuestionValue) => void` | - | Called whenever the draft selection or text changes. |
| `onSubmit` | `(response: QuestionResponse, event: React.FormEvent<HTMLFormElement>) => void \| Promise<void>` | - | Called with the selected values, optional trimmed text, and original form event. May return a promise for asynchronous responses. |
| `...props` | `React.ComponentProps<"form">` | - | Any other props are spread to the form element. |

### `<QuestionPrompt />`

Displays the question text. Props extend `React.HTMLAttributes<HTMLParagraphElement>`.

### `<QuestionDescription />`

Displays supporting instructions. Props extend `React.HTMLAttributes<HTMLParagraphElement>`.

### `<QuestionOptions />`

Groups `QuestionOption` children and applies radio-group or checkbox-group semantics based on `selectionMode`. Props extend `React.HTMLAttributes<HTMLDivElement>`.

### `<QuestionOption />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The stable value included in selectedValues when the option is selected. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the shadcn/ui Button. |

### `<QuestionInput />`

A controlled textarea backed by the question draft's `text` value. Props extend `React.ComponentProps<typeof Textarea>`.

### `<QuestionActions />`

A container for the submit action or other controls. Props extend `React.HTMLAttributes<HTMLDivElement>`.

### `<QuestionSubmit />`

Submits the current response and disables itself while the response is empty or the question is disabled. Props extend `React.ComponentProps<typeof Button>`.

## Types

```ts
interface QuestionValue {
  selectedValues: readonly string[];
  text: string;
}

interface QuestionResponse {
  selectedValues: readonly string[];
  text?: string;
}
```
