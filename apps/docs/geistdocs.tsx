export const Logo = () => (
  <div className="flex items-center gap-2">
    <p className="font-semibold text-xl tracking-tight">AI Elements</p>
  </div>
);

export const github = {
  owner: "vercel",
  repo: "ai-element",
};

export const nav = [
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Source",
    href: `https://github.com/${github.owner}/${github.repo}/`,
  },
];

export const suggestions = [
  "What is AI Elements?",
  "What can I build with AI Elements?",
  "What is AI Elements?",
  "How much does AI Elements cost?",
];

export const title = "AI Elements Documentation";

export const prompt =
  "You are a helpful assistant specializing in answering questions about AI Elements, a component library and custom registry built on top of shadcn/ui to help you build AI-native applications faster.";

export const translations = {
  en: {
    displayName: "English",
  },
};

export const basePath: string | undefined = "/elements";
