"use client";

import type { ToolUIPart } from "ai";

import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@/components/ai-elements/sandbox";
import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/ai-elements/stack-trace";
import { Button } from "@/components/ui/button";
import { memo, useCallback, useState } from "react";

const code = `import math

def calculate_primes(limit):
    """Find all prime numbers up to a given limit using Sieve of Eratosthenes."""
    sieve = [True] * (limit + 1)
    sieve[0] = sieve[1] = False
    
    for i in range(2, int(math.sqrt(limit)) + 1):
        if sieve[i]:
            for j in range(i * i, limit + 1, i):
                sieve[j] = False
    
    return [i for i, is_prime in enumerate(sieve) if is_prime]

if __name__ == "__main__":
    primes = calculate_primes(50)
    print(f"Found {len(primes)} prime numbers up to 50:")
    print(primes)`;

const outputs: Record<ToolUIPart["state"], string | undefined> = {
  "input-available": undefined,
  "input-streaming": undefined,
  "output-available": `Found 15 prime numbers up to 50:
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]`,
  "output-error": `TypeError: Cannot read properties of undefined (reading 'map')
    at calculatePrimes (/src/utils/primes.ts:15:23)
    at runCalculation (/src/components/Calculator.tsx:42:12)
    at onClick (/src/components/Button.tsx:18:5)
    at HTMLButtonElement.dispatch (node_modules/react-dom/cjs/react-dom.development.js:3456:9)
    at node_modules/react-dom/cjs/react-dom.development.js:4245:12`,
};

const states: ToolUIPart["state"][] = [
  "input-streaming",
  "input-available",
  "output-available",
  "output-error",
];

interface StateButtonProps {
  s: ToolUIPart["state"];
  currentState: ToolUIPart["state"];
  onStateChange: (state: ToolUIPart["state"]) => void;
}

const StateButton = memo(
  ({ s, currentState, onStateChange }: StateButtonProps) => {
    const handleClick = useCallback(() => onStateChange(s), [onStateChange, s]);
    return (
      <Button
        key={s}
        onClick={handleClick}
        size="sm"
        variant={currentState === s ? "default" : "outline"}
      >
        {s}
      </Button>
    );
  }
);

StateButton.displayName = "StateButton";

const Example = () => {
  const [state, setState] = useState<ToolUIPart["state"]>("output-available");

  const handleStateChange = useCallback((s: ToolUIPart["state"]) => {
    setState(s);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {states.map((s) => (
          <StateButton
            currentState={state}
            key={s}
            onStateChange={handleStateChange}
            s={s}
          />
        ))}
      </div>

      <Sandbox>
        <SandboxHeader state={state} title="primes.py" />
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent value="code">
              <CodeBlock
                className="border-0"
                code={
                  state === "input-streaming" ? "# Generating code..." : code
                }
                language="python"
              >
                <CodeBlockCopyButton
                  className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  size="sm"
                />
              </CodeBlock>
            </SandboxTabContent>
            <SandboxTabContent value="output">
              {state === "output-error" ? (
                <StackTrace
                  className="rounded-none border-0"
                  defaultOpen
                  trace={outputs[state] ?? ""}
                >
                  <StackTraceHeader>
                    <StackTraceError>
                      <StackTraceErrorType />
                      <StackTraceErrorMessage />
                    </StackTraceError>
                    <StackTraceActions>
                      <StackTraceCopyButton />
                      <StackTraceExpandButton />
                    </StackTraceActions>
                  </StackTraceHeader>
                  <StackTraceContent>
                    <StackTraceFrames />
                  </StackTraceContent>
                </StackTrace>
              ) : (
                <CodeBlock
                  className="border-0"
                  code={outputs[state] ?? ""}
                  language="log"
                >
                  <CodeBlockCopyButton
                    className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    size="sm"
                  />
                </CodeBlock>
              )}
            </SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </div>
  );
};

export default Example;
