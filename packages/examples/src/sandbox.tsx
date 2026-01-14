"use client";

import {
  Sandbox,
  SandboxCode,
  SandboxContent,
  SandboxHeader,
  SandboxOutput,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@repo/elements/sandbox";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import type { ToolUIPart } from "ai";
import { useState } from "react";

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
  "input-streaming": undefined,
  "input-available": undefined,
  "output-available": `Found 15 prime numbers up to 50:
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]`,
  "output-error": `Traceback (most recent call last):
  File "primes.py", line 15, in <module>
    primes = calculate_primes(50)
  File "primes.py", line 4, in calculate_primes
    sieve = [True] * (limit + 1)
TypeError: can only concatenate str (not "int") to str`,
};

const states: ToolUIPart["state"][] = [
  "input-streaming",
  "input-available",
  "output-available",
  "output-error",
];

const Example = () => {
  const [state, setState] = useState<ToolUIPart["state"]>("output-available");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {states.map((s) => (
          <Button
            key={s}
            onClick={() => setState(s)}
            size="sm"
            variant={state === s ? "default" : "outline"}
          >
            {s}
          </Button>
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
              <SandboxCode
                code={
                  state === "input-streaming" ? "# Generating code..." : code
                }
                language="python"
              />
            </SandboxTabContent>
            <SandboxTabContent value="output">
              <SandboxOutput code={outputs[state] ?? ""} />
            </SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </div>
  );
};

export default Example;
