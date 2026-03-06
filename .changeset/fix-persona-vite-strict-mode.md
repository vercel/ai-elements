---
"ai-elements": patch
---

Fix Persona crashing in Vite dev mode by deferring WebGL2 context creation to avoid exhausting browser context limits during React Strict Mode's double-mount cycle.
