---
"ai-elements": patch
---

code-block.tsx: TokensResult fg/bg are optional in Shiki types, but TokenizedCode requires string (strictNullChecks error)
