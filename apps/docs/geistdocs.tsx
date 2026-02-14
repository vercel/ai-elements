export const Logo = () => (
  <div className="flex items-center gap-2">
    <p className="font-semibold text-xl tracking-tight">AI Elements</p>
  </div>
);

export const github = {
  owner: "vercel",
  repo: "ai-elements",
};

export const nav = [
  {
    href: "/docs",
    label: "Docs",
  },
  {
    href: "/components",
    label: "Components",
  },
  {
    href: "/examples",
    label: "Examples",
  },
];

export const suggestions = [
  "What is AI Elements?",
  "What can I build with AI Elements?",
  "How do I install AI Elements?",
  "How do I use AI Elements?",
];

export const title = "AI Elements Documentation";

export const prompt =
  "You are a helpful assistant specializing in answering questions about AI Elements, a component library and custom registry built on top of shadcn/ui to help you build AI-native applications faster.";

export const translations = {
  en: {
    displayName: "English",
  },
};

export const basePath: string | undefined = undefined;

export const siteId: string | undefined = "ai-elements";