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
};

const templates = [
  {
    title: "AI Chatbot",
    description: "A full-featured chat interface with streaming, markdown and file attachments.",
    link: "https://github.com/haydenbleasel/ai-elements/tree/main/templates/chatbot",
    image: "https://placehold.co/600x400.png",
  },
  {
    title: "Code Assistant",
    description: "IDE-style interface with syntax highlighting, terminal output and file trees.",
    link: "https://github.com/haydenbleasel/ai-elements/tree/main/templates/code-assistant",
    image: "https://placehold.co/600x400.png",
  },
  {
    title: "Voice Agent",
    description: "Real-time voice interface with transcription, audio playback and mic selection.",
    link: "https://github.com/haydenbleasel/ai-elements/tree/main/templates/voice-agent",
    image: "https://placehold.co/600x400.png",
  },
];

const textGridSection = [
  {
    id: "1",
    title: "Fully Composable",
    description: "Every component is a building block. Combine small, focused pieces to create exactly the UI you need.",
  },
  {
    id: "2",
    title: "AI SDK Integration",
    description: "Deep integration with the AI SDK. Streaming, status states and type safety built-in.",
  },
  {
    id: "3",
    title: "shadcn/ui Foundation",
    description: "Built on shadcn/ui conventions. Your existing theme and setup apply automatically.",
  },
];

const HomePage = () => (
  <div className="container mx-auto max-w-5xl">
    <Hero
      badge="AI Elements v2 is now live!"
      description={description}
      title={title}
    >
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
        <div className="aspect-video rounded-lg border bg-background" />
      </OneTwoSection>
      <Templates
        data={templates}
        description="See AI Elements in action with one of our starter templates."
        title="Get started quickly"
      />
      <CTA cta="Get started" href="/docs" title="Start building AI interfaces today" />
    </div>
  </div>
);

export default HomePage;
