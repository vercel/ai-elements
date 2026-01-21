import Agent from "@repo/examples/agent";
import ChainOfThought from "@repo/examples/chain-of-thought";
import CodeBlock from "@repo/examples/code-block";
import EnvironmentVariables from "@repo/examples/environment-variables";
import FileTree from "@repo/examples/file-tree";
import PackageInfo from "@repo/examples/package-info";
import Persona from "@repo/examples/persona-obsidian";
import Plan from "@repo/examples/plan";
import PromptInput from "@repo/examples/prompt-input-cursor";
import Queue from "@repo/examples/queue";
import SchemaDisplay from "@repo/examples/schema-display";
import StackTrace from "@repo/examples/stack-trace";
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
    title: "Template 1",
    description: "Description of template 1",
    link: "https://example.com/template-1",
    image: "https://placehold.co/600x400.png",
  },
  {
    title: "Template 2",
    description: "Description of template 2",
    link: "https://example.com/template-2",
    image: "https://placehold.co/600x400.png",
  },
  {
    title: "Template 3",
    description: "Description of template 3",
    link: "https://example.com/template-3",
    image: "https://placehold.co/600x400.png",
  },
];

const textGridSection = [
  {
    id: "1",
    title: "Text Grid Section",
    description: "Description of text grid section",
  },
  {
    id: "2",
    title: "Text Grid Section",
    description: "Description of text grid section",
  },
  {
    id: "3",
    title: "Text Grid Section",
    description: "Description of text grid section",
  },
];

const HomePage = () => (
  <>
    <div className="relative flex h-[70vh] items-center justify-center overflow-hidden">
      <div className="container relative z-10 mx-auto max-w-5xl">
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
      </div>

      <div className="absolute inset-0 grid rotate-3 -skew-x-12 grid-cols-4 items-start gap-4 opacity-30">
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
            <ChainOfThought />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <Agent />
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
        <div className="grid gap-4">
          <div className="rounded-lg border bg-background p-4">
            <FileTree />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <PackageInfo />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <SchemaDisplay />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <StackTrace />
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-[20vh] bg-linear-to-t from-sidebar to-transparent" />
    </div>
    <div className="container mx-auto max-w-5xl">
      <div className="grid divide-y border-y sm:border-x">
        <TextGridSection data={textGridSection} />
        <CenteredSection
          description="Description of centered section"
          title="Centered Section"
        >
          <div className="aspect-video rounded-lg border bg-background" />
        </CenteredSection>
        <OneTwoSection
          description="Description of one/two section"
          title="One/Two Section"
        >
          <div className="aspect-video rounded-lg border bg-background" />
        </OneTwoSection>
        <Templates
          data={templates}
          description="See Geistdocs in action with one of our templates."
          title="Get started quickly"
        />
        <CTA cta="Get started" href="/docs" title="Start your docs today" />
      </div>
    </div>
  </>
);

export default HomePage;
