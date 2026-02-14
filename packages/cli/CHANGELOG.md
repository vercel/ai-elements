# ai-elements

## 1.8.4

### Patch Changes

- 8bdd7fe: React improvements

## 1.8.3

### Patch Changes

- f0c9bd5: Migrate to Oxlint
- cf808a4: Add ability to download conversation as markdown
- 357c01d: Fix type generic issue in Reasoning
- 9348f89: Fix autoclosing Reasoning components
- f54b3ef: PromptInput tooltip & keyboard configuration support
- a689aec: Fix PromptInput responsiveness
- c163d7a: feat(examples): wire SpeechInput into chatbot prompt footer
- d98785d: JSX Preview component

## 1.8.2

### Patch Changes

- cf793dd: Add new IDE example
- cf793dd: Deprecate Loader component for shadcn/ui Spinner
- ce1606a: Fix Tool padding
- cf793dd: code-block.tsx: TokensResult fg/bg are optional in Shiki types, but TokenizedCode requires string (strictNullChecks error)
- d78b009: Fix chain-of-thoughts dropdown arrow alignment by replacing `max-w-prose` with `w-full` for proper responsive layout.
- abeda54: Fix relative registry dependency links

## 1.8.1

### Patch Changes

- 4ad4531: Bump ansi-to-react
- 03ee8e1: fix silenced classname prop in message branch navigation component
- 005e36a: Add skills

## 1.8.0

### Minor Changes

- 2dd23cf: Attachments
- cc59f4d: Create Snippet component for lightweight inline code display.
- fa00d46: Create PackageInfo component for dependency version changes.
- 97c6e47: Create Commit component for displaying commit info.
- d444778: Create StackTrace component
- 1ac4397: Create Agent UI
- e51d04a: Upgrade CodeBlock
- ea591fc: Create Terminal component with ANSI color support.
- 84f15f6: Create FileTree component for hierarchical file display.
- f7b04e6: Create SchemaDisplay component for API endpoint visualization.
- 9876e51: Create TestResults component for test suite visualization.
- 04242be: Added Sandbox component

### Patch Changes

- 3dfde7c: fix(elements): adjust model selector outline
- f1a7c74: Environment Variables component
- 8791981: Enhance PromptInput with SourceDocument functionality
- d1ab925: fix: aliases.components isn't respected in components.json
- d00f490: allow passing onKeyDown prop to PromptInputTextarea
- 8a4a6fe: Add VoiceSelectorPreview
- 6231366: Added missing `group` class to Tool's Collapsible wrapper to enable chevron rotation animation on open/close
- 3c7fee4: Fix button transparency in dark mode for scrollToBottom
- 0679825: Make the Tool component work with DynamicToolUIPart
- 1bc771d: fix: able to add more than one file when maxFiles is 1 and multiple is false in PromptInput
- 045453d: Added `onStop` prop to the `PromptInputSubmit` component.

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
