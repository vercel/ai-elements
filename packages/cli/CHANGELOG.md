# ai-elements

## 1.6.4

### Patch Changes

- a5eeca4: Adding multiple attachments sequentially breaks the prompt-input
- 787dfc3: ReasoningTrigger allows custom getThinkingMessage function
- 68bc484: fix(prompt-input): Adjust image preview hover state and alignment in input head
- 56ea3b9: build: expect errors for states added in ai-sdk v6
- a726985: fix(prompt-input): Reset file input value to allow re-selecting previously removed files
- 0fbdc6a: Fix multiple memoization and perf issues with PromptInput

## 1.6.3

### Patch Changes

- b0d5347: Fix model selector logos in dark mode
- ae31076: Fix duplicate overflows in Conversation element

## 1.6.2

### Patch Changes

- a1b1929: Fix: Update PromptInputSpeechButton SpeechRecognition usage

## 1.6.1

### Patch Changes

- f887f5c: Update PromptInputMessage to use AI SDK types
- 6fa1d46: fix(reasoning): make "Thought for a few seconds" message reachable
- d3d91ba: Remove unused hast type
- e6c656c: fix(model-selector): add DialogTitle for ModelSelectorContent
- 342bb23: fix prompt-input onSubmit types
- 70bf5fd: chore: fix checkpoint overflow

## 1.6.0

### Minor Changes

- 3c34582: Create new Checkpoint component
- 1ac23c8: Add MessageAttachments
- 29c2d43: Add ModelSelector component
- d5f1159: Merge Actions, Branch and Response into Message

### Patch Changes

- 5a5342e: fix: ensure prompt input attachments render inside header
- 478ec07: Use CornerDownLeftIcon for prompt input
- 227d1ca: change ChainOfThoughtStep label and description types from string to ReactNode
- 61a25e5: Fix open-in-chat trigger icon
- 0a5297c: Remove Controls from Canvas
- 5c16b4f: Add `use client` directive to open-in-chat
- 328173b: Polyfill ToolUIPart["approval"] in latest AI SDK
- 0c53bac: Add support for multiple CLI args

## 1.5.0

### Minor Changes

- 9ede551: Open source documentation

### Patch Changes

- 619416a: Add AI Elements MCP server
- dccf114: replace jsdom with Vitest Browser Mode
- 40067f2: chore: lint @typescript-eslint/no-redeclare
- cdd4d0b: test: add vitest-fail-on-console and improve test stability
- a7128ab: feat: improve layout and design of PromptInputAttachments #151
- 4a5afad: Fix type error in Edge component by using const assertion
- 2135d80: refactor: replace react-syntax-highlighter with shiki in CodeBlock
- 2fce23c: Fix type error in InlineCitationCardTrigger by checking sources[0] directly
- a848cf8: refactor: update tokenlens api
- 27dbfc2: Use optional chaining for speech recognition result access
- 686577d: feat: add tool approval state and tool approval component
