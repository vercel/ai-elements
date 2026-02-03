import matter from "gray-matter";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const ROOT_DIR = join(import.meta.dirname, "../../..");
const DOCS_DIR = join(ROOT_DIR, "apps/docs/content/docs");
const COMPONENTS_DIR = join(DOCS_DIR, "components");
const EXAMPLES_DIR = join(ROOT_DIR, "packages/examples/src");
const SKILLS_DIR = join(ROOT_DIR, "skills");
const SKILL_DIR = join(SKILLS_DIR, "ai-elements");

const discoverMdxFiles = async (dir: string): Promise<string[]> => {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await discoverMdxFiles(fullPath)));
    } else if (entry.name.endsWith(".mdx")) {
      results.push(fullPath);
    }
  }

  return results;
};

const replacePreviews = (content: string): string =>
  content.replaceAll(
    /<Preview\s+path=["']([^"']+)["']\s*\/>/g,
    (_, path) => `See \`scripts/${path}.tsx\` for this example.`
  );

const removeCustomComponents = (content: string): string =>
  content
    .replaceAll(/<ElementsInstaller\s*\/>/g, "")
    .replaceAll(/<ElementsDemo\s*\/>/g, "")
    .replaceAll(/<Callout>\s*[\s\S]*?<\/Callout>/g, "");

const replaceInstaller = (content: string): string =>
  content.replaceAll(
    /<ElementsInstaller\s+path=["']([^"']+)["']\s*\/>/g,
    (_, component) =>
      `\`\`\`bash\nnpx ai-elements@latest add ${component}\n\`\`\``
  );

const PROP_REGEX = /['"]?([^'":\s]+)['"]?\s*:\s*\{([^}]+)\}/g;
const DESC_REGEX = /description:\s*['"]([^'"]+)['"]/;
const TYPE_REGEX = /type:\s*['"]([^'"]+)['"]/;
const DEFAULT_REGEX = /default:\s*['"]([^'"]+)['"]/;
const REQUIRED_REGEX = /required:\s*true/;

const parseTypeTableProps = (
  typeContent: string
): {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string;
}[] => {
  const props: {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    default?: string;
  }[] = [];

  const matches = typeContent.matchAll(PROP_REGEX);

  for (const match of matches) {
    const propName = match[1];
    const propBody = match[2];

    const descMatch = propBody.match(DESC_REGEX);
    const typeMatch = propBody.match(TYPE_REGEX);
    const defaultMatch = propBody.match(DEFAULT_REGEX);
    const requiredMatch = propBody.match(REQUIRED_REGEX);

    props.push({
      default: defaultMatch?.[1],
      description: descMatch?.[1] || "",
      name: propName,
      required: !!requiredMatch,
      type: typeMatch?.[1] || "unknown",
    });
  }

  return props;
};

const replaceTypeTables = (content: string): string => {
  const typeTableRegex = /<TypeTable\s+type=\{\{([\s\S]*?)\}\}\s*\/>/g;

  return content.replace(typeTableRegex, (_, typeContent) => {
    const props = parseTypeTableProps(typeContent);

    if (props.length === 0) {
      return "";
    }

    const rows = props.map((prop) => {
      const name = `\`${prop.name}\``;
      const type = `\`${prop.type}\``;
      let defaultVal = "-";
      if (prop.required) {
        defaultVal = "Required";
      } else if (prop.default) {
        defaultVal = `\`${prop.default}\``;
      }
      return `| ${name} | ${type} | ${defaultVal} | ${prop.description} |`;
    });

    return [
      "| Prop | Type | Default | Description |",
      "|------|------|---------|-------------|",
      ...rows,
    ].join("\n");
  });
};

const removeCallouts = (content: string): string =>
  content.replaceAll(/<Callout[^>]*>[\s\S]*?<\/Callout>/g, "");

const transformComponentMdx = (fileContent: string): string => {
  const { content } = matter(fileContent);

  let processedContent = replacePreviews(content);
  processedContent = replaceInstaller(processedContent);
  processedContent = replaceTypeTables(processedContent);
  processedContent = removeCallouts(processedContent);

  return processedContent.trim();
};

const transformOverviewMdx = (fileContent: string): string => {
  const { content } = matter(fileContent);

  let processedContent = removeCustomComponents(content);
  processedContent = processedContent.trim();

  return processedContent;
};

const findMatchingExamples = async (
  componentName: string
): Promise<string[]> => {
  const files = await readdir(EXAMPLES_DIR);

  return files.filter((file) => {
    const fileBasename = file.replace(".tsx", "");
    return (
      file.endsWith(".tsx") &&
      (fileBasename === componentName ||
        fileBasename.startsWith(`${componentName}-`))
    );
  });
};

const cleanSkillsDir = (): void => {
  if (existsSync(SKILLS_DIR)) {
    rmSync(SKILLS_DIR, { recursive: true });
  }
  mkdirSync(SKILLS_DIR, { recursive: true });
};

const generateOverviewSkill = async (): Promise<void> => {
  const indexContent = await readFile(join(DOCS_DIR, "index.mdx"), "utf8");
  const usageContent = await readFile(join(DOCS_DIR, "usage.mdx"), "utf8");
  const troubleshootingContent = await readFile(
    join(DOCS_DIR, "troubleshooting.mdx"),
    "utf8"
  );

  const skillContent = `---
name: ai-elements
description: Create new AI chat interface components for the ai-elements library following established composable patterns, shadcn/ui integration, and Vercel AI SDK conventions. Use when creating new components in packages/elements/src or when the user asks to add a new component to ai-elements.
---

# AI Elements

${transformOverviewMdx(indexContent)}

## Usage

${transformOverviewMdx(usageContent)}

## Troubleshooting

${transformOverviewMdx(troubleshootingContent)}

## Available Components

See the \`references/\` folder for detailed documentation on each component.
`;

  mkdirSync(SKILL_DIR, { recursive: true });
  await writeFile(join(SKILL_DIR, "SKILL.md"), skillContent);
  console.log("Generated: SKILL.md (overview)");
};

const processComponent = async (mdxPath: string): Promise<number> => {
  const componentName = basename(mdxPath, ".mdx");
  const referencesDir = join(SKILL_DIR, "references");
  const scriptsDir = join(SKILL_DIR, "scripts");

  const fileContent = await readFile(mdxPath, "utf8");
  const { data } = matter(fileContent);

  const referenceContent = `# ${data.title}

${data.description}

${transformComponentMdx(fileContent)}
`;

  mkdirSync(referencesDir, { recursive: true });
  await writeFile(join(referencesDir, `${componentName}.md`), referenceContent);

  const examples = await findMatchingExamples(componentName);

  if (examples.length > 0) {
    mkdirSync(scriptsDir, { recursive: true });
    for (const example of examples) {
      const exampleContent = await readFile(
        join(EXAMPLES_DIR, example),
        "utf8"
      );
      const transformedContent = exampleContent
        .replaceAll('@repo/shadcn-ui/', "@/")
        .replaceAll('@repo/elements/', "@/components/ai-elements/");
      await writeFile(join(scriptsDir, example), transformedContent);
    }
  }

  console.log(
    `Generated: references/${componentName}.md (${examples.length} examples)`
  );
  return examples.length;
};

const main = async (): Promise<void> => {
  console.log("Generating ai-elements skill from docs and examples...\n");

  cleanSkillsDir();

  await generateOverviewSkill();

  const mdxFiles = await discoverMdxFiles(COMPONENTS_DIR);
  console.log(`\nFound ${mdxFiles.length} component MDX files\n`);

  let totalExamples = 0;
  for (const mdxPath of mdxFiles) {
    totalExamples += await processComponent(mdxPath);
  }

  console.log(
    `\nDone! Generated ${mdxFiles.length} references with ${totalExamples} examples.`
  );
};

main().catch(console.error);
