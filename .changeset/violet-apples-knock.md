---
"ai-elements": minor
---

Summary

Adds the ability to stop an ongoing AI generation by introducing an onStop prop to the PromptInputSubmit component. This integrates seamlessly with the AI SDK's useChat hook.

Changes

- Added onStop?: () => void prop to PromptInputSubmitProps
- When onStop is provided and the chat is generating (status === "submitted" or status === "streaming"), the button:
  - Changes from a submit button to a stop button (type="button")
  - Calls onStop() on click instead of submitting the form
- Updates aria-label from "Submit" to "Stop" for accessibility
- Preserves any custom onClick handler when not in stop mode
- Non-breaking: existing usage without onStop works exactly as before
