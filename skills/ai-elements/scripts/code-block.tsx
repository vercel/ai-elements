"use client";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockLanguageSelector,
  CodeBlockLanguageSelectorContent,
  CodeBlockLanguageSelectorItem,
  CodeBlockLanguageSelectorTrigger,
  CodeBlockLanguageSelectorValue,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
import { FileIcon } from "lucide-react";
import { useState } from "react";
import type { BundledLanguage } from "shiki";

const codeExamples = {
  typescript: {
    filename: "greet.ts",
    code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  },
  python: {
    filename: "greet.py",
    code: `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))`,
  },
  rust: {
    filename: "greet.rs",
    code: `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}`,
  },
  go: {
    filename: "greet.go",
    code: `package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println(greet("World"))
}`,
  },
} as const;

type Language = keyof typeof codeExamples;

const languages: { value: Language; label: string }[] = [
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

const Example = () => {
  const [language, setLanguage] = useState<Language>("typescript");
  const { code, filename } = codeExamples[language];

  return (
    <CodeBlock code={code} language={language as BundledLanguage}>
      <CodeBlockHeader>
        <CodeBlockTitle>
          <FileIcon size={14} />
          <CodeBlockFilename>{filename}</CodeBlockFilename>
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockLanguageSelector
            onValueChange={(value) => setLanguage(value as Language)}
            value={language}
          >
            <CodeBlockLanguageSelectorTrigger>
              <CodeBlockLanguageSelectorValue />
            </CodeBlockLanguageSelectorTrigger>
            <CodeBlockLanguageSelectorContent>
              {languages.map((lang) => (
                <CodeBlockLanguageSelectorItem
                  key={lang.value}
                  value={lang.value}
                >
                  {lang.label}
                </CodeBlockLanguageSelectorItem>
              ))}
            </CodeBlockLanguageSelectorContent>
          </CodeBlockLanguageSelector>
          <CodeBlockCopyButton
            onCopy={() => console.log("Copied code to clipboard")}
            onError={() => console.error("Failed to copy code to clipboard")}
          />
        </CodeBlockActions>
      </CodeBlockHeader>
    </CodeBlock>
  );
};

export default Example;
