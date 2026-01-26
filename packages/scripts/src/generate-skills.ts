import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import matter from 'gray-matter';

const ROOT_DIR = join(import.meta.dirname, '../../..');
const DOCS_DIR = join(ROOT_DIR, 'apps/docs/content/docs/components');
const EXAMPLES_DIR = join(ROOT_DIR, 'packages/examples/src');
const SKILLS_DIR = join(ROOT_DIR, 'skills');

const discoverMdxFiles = async (dir: string): Promise<string[]> => {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await discoverMdxFiles(fullPath));
    } else if (entry.name.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }

  return results;
};

const removePreviews = (content: string): string => {
  return content.replace(/<Preview\s+path=["'][^"']+["']\s*\/>/g, '');
};

const replaceInstaller = (content: string): string => {
  return content.replace(
    /<ElementsInstaller\s+path=["']([^"']+)["']\s*\/>/g,
    (_, component) => '```bash\nnpx ai-elements@latest add ' + component + '\n```'
  );
};

const parseTypeTableProps = (typeContent: string): Array<{
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string;
}> => {
  const props: Array<{
    name: string;
    type: string;
    description: string;
    required?: boolean;
    default?: string;
  }> = [];

  const propRegex = /['"]?([^'":\s]+)['"]?\s*:\s*\{([^}]+)\}/g;
  let match;

  while ((match = propRegex.exec(typeContent)) !== null) {
    const propName = match[1];
    const propBody = match[2];

    const descMatch = propBody.match(/description:\s*['"]([^'"]+)['"]/);
    const typeMatch = propBody.match(/type:\s*['"]([^'"]+)['"]/);
    const defaultMatch = propBody.match(/default:\s*['"]([^'"]+)['"]/);
    const requiredMatch = propBody.match(/required:\s*true/);

    props.push({
      name: propName,
      type: typeMatch?.[1] || 'unknown',
      description: descMatch?.[1] || '',
      required: !!requiredMatch,
      default: defaultMatch?.[1],
    });
  }

  return props;
};

const replaceTypeTables = (content: string): string => {
  const typeTableRegex = /<TypeTable\s+type=\{\{([\s\S]*?)\}\}\s*\/>/g;

  return content.replace(typeTableRegex, (_, typeContent) => {
    const props = parseTypeTableProps(typeContent);

    if (props.length === 0) {
      return '';
    }

    const rows = props.map((prop) => {
      const name = `\`${prop.name}\``;
      const type = `\`${prop.type}\``;
      const defaultVal = prop.required
        ? 'Required'
        : prop.default
          ? `\`${prop.default}\``
          : '-';
      return `| ${name} | ${type} | ${defaultVal} | ${prop.description} |`;
    });

    return [
      '| Prop | Type | Default | Description |',
      '|------|------|---------|-------------|',
      ...rows,
    ].join('\n');
  });
};

const transformMdx = (fileContent: string, title: string, description: string): string => {
  const { content } = matter(fileContent);

  let processedContent = removePreviews(content);
  processedContent = replaceInstaller(processedContent);
  processedContent = replaceTypeTables(processedContent);

  const frontmatter = [
    '---',
    `name: Using the ${title} component from AI Elements`,
    `description: ${description}`,
    '---',
  ].join('\n');

  return `${frontmatter}\n${processedContent}`;
};

const findMatchingExamples = async (componentName: string): Promise<string[]> => {
  const files = await readdir(EXAMPLES_DIR);

  return files.filter((file) => {
    const fileBasename = file.replace('.tsx', '');
    return (
      file.endsWith('.tsx') &&
      (fileBasename === componentName || fileBasename.startsWith(`${componentName}-`))
    );
  });
};

const cleanSkillsDir = (): void => {
  if (existsSync(SKILLS_DIR)) {
    rmSync(SKILLS_DIR, { recursive: true });
  }
  mkdirSync(SKILLS_DIR, { recursive: true });
};

const processComponent = async (mdxPath: string): Promise<void> => {
  const componentName = basename(mdxPath, '.mdx');
  const skillDir = join(SKILLS_DIR, `use-${componentName}-component`);
  const scriptsDir = join(skillDir, 'scripts');

  const fileContent = await readFile(mdxPath, 'utf-8');
  const { data } = matter(fileContent);

  const skillContent = transformMdx(fileContent, data.title, data.description);
  const examples = await findMatchingExamples(componentName);

  mkdirSync(skillDir, { recursive: true });
  await writeFile(join(skillDir, 'SKILL.md'), skillContent);

  if (examples.length > 0) {
    mkdirSync(scriptsDir, { recursive: true });
    for (const example of examples) {
      await copyFile(join(EXAMPLES_DIR, example), join(scriptsDir, example));
    }
  }

  console.log(`Generated: use-${componentName}-component (${examples.length} examples)`);
};

const main = async (): Promise<void> => {
  console.log('Generating skills from docs and examples...\n');

  cleanSkillsDir();

  const mdxFiles = await discoverMdxFiles(DOCS_DIR);
  console.log(`Found ${mdxFiles.length} MDX files\n`);

  for (const mdxPath of mdxFiles) {
    await processComponent(mdxPath);
  }

  console.log('\nDone!');
};

main().catch(console.error);
