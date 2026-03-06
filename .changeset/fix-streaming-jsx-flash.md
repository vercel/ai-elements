---
"ai-elements": patch
---

Fix JSXPreview flashing between rendered content and parse errors during streaming. Strip incomplete tags cut off mid-attribute, and fall back to last successfully rendered JSX when parse errors occur during streaming.
