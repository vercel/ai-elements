import Agent from "@repo/examples/agent";
import ChainOfThought from "@repo/examples/chain-of-thought";
import CodeBlock from "@repo/examples/code-block";
import EnvironmentVariables from "@repo/examples/environment-variables";
import Persona from "@repo/examples/persona-obsidian";
import Plan from "@repo/examples/plan";
import PromptInput from "@repo/examples/prompt-input-cursor";
import Queue from "@repo/examples/queue";
import Task from "@repo/examples/task";
import Tool from "@repo/examples/tool";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import DynamicLink from "fumadocs-core/dynamic-link";
import type { Metadata } from "next";
import { Installer } from "@/components/geistdocs/installer";
import { CenteredSection } from "./components/centered-section";
import { CTA } from "./components/cta";
import { Hero } from "./components/hero";
import { OneTwoSection } from "./components/one-two-section";
import { Templates } from "./components/templates";
import { TextGridSection } from "./components/text-grid-section";

const title = "AI Elements";
const description =
  "A component library and custom registry built on top of shadcn/ui to help you build AI-native applications faster.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const templates = [
  {
    title: "Chatbot",
    description:
      "A full-featured chat interface with streaming, markdown and file attachments.",
    link: "/examples/chatbot",
    file: "demo-chatgpt",
  },
  {
    title: "IDE",
    description:
      "IDE-style interface with syntax highlighting, terminal output and file trees.",
    link: "/examples/ide",
    file: "demo-cursor",
  },
  {
    title: "Workflow",
    description: "Visualize and interact with your AI workflows.",
    link: "/examples/workflow",
    file: "demo-workflow",
  },
];

const textGridSection = [
  {
    id: "1",
    title: "Fully Composable",
    description:
      "Every component is a building block. Combine small, focused pieces to create exactly the UI you need.",
  },
  {
    id: "2",
    title: "AI SDK Integration",
    description:
      "Deep integration with the AI SDK. Streaming, status states and type safety built-in.",
  },
  {
    id: "3",
    title: "shadcn/ui Foundation",
    description:
      "Built on shadcn/ui conventions. Your existing theme and setup apply automatically.",
  },
];

const HomePage = () => (
  <div className="container mx-auto max-w-5xl">
    <Hero description={description} title={title}>
      <div className="mx-auto inline-flex w-fit items-center gap-3">
        <Button asChild className="px-4" size="lg">
          <DynamicLink href="/[lang]/components">
            Explore Components
          </DynamicLink>
        </Button>
        <Installer command="npx ai-elements" />
      </div>
    </Hero>
    <div className="grid divide-y border-y sm:border-x">
      <TextGridSection data={textGridSection} />
      <CenteredSection
        description="Mix and match components to build chat experiences, workflows, IDEs, voice agents and more."
        title="Components to build anything"
      >
        <div className="relative aspect-video">
          <div className="absolute -inset-40 top-8 grid rotate-3 -skew-x-12 grid-cols-3 items-start gap-4">
            <div className="grid gap-4">
              <div className="rounded-lg border bg-background p-4">
                <Queue />
              </div>
              <div className="rounded-lg border bg-background p-4">
                <PromptInput />
              </div>
              <div className="rounded-lg border bg-background p-4">
                <Persona />
              </div>
              <div className="rounded-lg border bg-background p-4">
                <Plan />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-lg border bg-background p-4">
                <Agent />
              </div>
              <div className="rounded-lg border bg-background p-4">
                <ChainOfThought />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-lg border bg-background p-4">
                <Task />
              </div>
              <div className="rounded-lg border bg-background p-4">
                <Tool />
              </div>
              <div className="rounded-lg border bg-background p-4">
                <CodeBlock />
              </div>
              <div className="rounded-lg border bg-background p-4">
                <EnvironmentVariables />
              </div>
            </div>
          </div>
        </div>
      </CenteredSection>
      <OneTwoSection
        description="Install only what you need. The CLI adds components directly to your codebase with full source code access. No hidden dependencies, tree-shaking friendly."
        title="Fast, Flexible Installation"
      >
        <div className="aspect-video gap-2 rounded-lg border bg-background p-6 font-mono text-sm leading-relaxed">
          <span className="text-muted-foreground">$</span>
          <span className="ml-1">npx ai-elements@latest add conversation</span>
          <div className="mt-2 gap-1">
            <p>
              <span className="text-muted-foreground">✔</span> Checking
              registry.
            </p>
            <p>
              <span className="text-muted-foreground">✔</span> Installing
              dependencies.
            </p>
            <p>
              <span className="text-muted-foreground">✔</span> Created 1 file:
            </p>
            <p>
              <span className="ml-4">
                - components/ai-elements/conversation.tsx
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">ℹ</span> Skipped 1 files:
              (files might be identical, use --overwrite to overwrite)
            </p>
            <p>
              <span className="ml-4">- components/ui/button.tsx</span>
            </p>
          </div>
        </div>
      </OneTwoSection>
      <Templates
        data={templates}
        description="See AI Elements in action with one of our examples."
        title="Get started quickly"
      />
      <CTA
        cta="Get started"
        href="/docs"
        title="Start building AI interfaces today"
      />
    </div>
  </div>
);

export default HomePage;
