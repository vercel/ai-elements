import { promises as fs, readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Project } from 'ts-morph';

const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
const registryUrl = `${protocol}://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

const packageDir = join(process.cwd(), '..', '..', 'packages', 'elements');
const packagePath = join(packageDir, 'package.json');
const packageJson = JSON.parse(await readFile(packagePath, 'utf-8'));

const internalDependencies = Object.keys(packageJson.dependencies || {}).filter(
  (dep) => dep.startsWith('@repo') && dep !== '@repo/shadcn-ui'
);

const dependenciesSet = new Set(
  Object.keys(packageJson.dependencies || {}).filter(
    (dep) =>
      ![
        'react',
        'react-dom',
        '@repo/shadcn-ui',
        ...internalDependencies,
      ].includes(dep)
  )
);

const devDependenciesSet = new Set(
  Object.keys(packageJson.devDependencies || {}).filter(
    (dep) =>
      ![
        '@repo/typescript-config',
        '@types/react',
        '@types/react-dom',
        'typescript',
      ].includes(dep)
  )
);

// Registry should auto-add ai sdk v5 as a dependency
dependenciesSet.add('ai');
dependenciesSet.add('@ai-sdk/react');
dependenciesSet.add('zod');

const dependencies = Array.from(dependenciesSet);
const devDependencies = Array.from(devDependenciesSet);
const srcDir = join(packageDir, 'src');

const packageFiles = readdirSync(srcDir, { withFileTypes: true });
const tsxFiles = packageFiles.filter(
  (file) => file.isFile() && file.name.endsWith('.tsx')
);

const files: {
  type: string;
  path: string;
  content: string;
  target: string;
}[] = [];

const fileContents = await Promise.all(
  tsxFiles.map(async (file) => {
    const filePath = join(srcDir, file.name);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsedContent = content.replace(/@repo\/shadcn-ui\//g, '@/');

    return {
      type: 'registry:ui',
      path: file.name,
      content: parsedContent,
      target: `components/ai-elements/${file.name}`,
    };
  })
);

files.push(...fileContents);

const registryDependenciesSet = new Set<string>();

// Extract shadcn/ui components from file content
const shadcnComponents =
  files
    .map((f) => f.content)
    .join('\n')
    .match(/@\/components\/ui\/([a-z-]+)/g)
    ?.map((path) => path.split('/').pop())
    .filter((name): name is string => Boolean(name)) || [];

// Add shadcn/ui components to set
for (const component of shadcnComponents) {
  registryDependenciesSet.add(component);
}

const registryDependencies = Array.from(registryDependenciesSet);

const response = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  homepage: new URL('/elements', registryUrl).toString(),
  name: 'ai-elements',
  type: 'registry:ui',
  author: 'Hayden Bleasel <hayden.bleasel@vercel.com>',
  dependencies,
  devDependencies,
  registryDependencies,
  files,
};

type RequestProps = {
  params: Promise<{ component: string }>;
};

export const GET = async (request: NextRequest, { params }: RequestProps) => {
  const { component } = await params;
  const parsedComponent = component.replace('.json', '');

  if (parsedComponent === 'all') {
    return NextResponse.json(response);
  }

  // Only process the parsedComponent, not an array

  // Find the file for the requested component
  const file = response.files.find(
    (f) => f.path.replace('.tsx', '') === parsedComponent
  );

  if (!file) {
    return NextResponse.json(
      { error: `Component "${parsedComponent}" not found.` },
      { status: 404 }
    );
  }

  // Parse imports for the single component to determine actual dependencies
  const usedDependencies = new Set<string>();
  const usedDevDependencies = new Set<string>();
  const usedRegistryDependencies = new Set<string>();

  const project = new Project({ useInMemoryFileSystem: true });

  try {
    const sourceFile = project.createSourceFile(file.path, file.content);
    const imports = sourceFile
      .getImportDeclarations()
      .map((d) => d.getModuleSpecifierValue());

    for (const moduleName of imports) {
      if (!moduleName) continue;

      // Check if it's a relative dependency
      if (moduleName.startsWith('./')) {
        const relativePath = moduleName.split('/').pop();
        if (relativePath) {
          usedRegistryDependencies.add(
            new URL(`/${relativePath}.json`, registryUrl).toString()
          );
        }
      }

      // Check if it's a regular dependency
      if (dependencies.includes(moduleName)) {
        usedDependencies.add(moduleName);
      }

      // Check if it's a dev dependency (though less common in component files)
      if (devDependencies.includes(moduleName)) {
        usedDevDependencies.add(moduleName);
      }

      // Check if it's a registry dependency (shadcn/ui components)
      if (moduleName.startsWith('@/components/ui/')) {
        const componentName = moduleName.split('/').pop();
        if (componentName) {
          usedRegistryDependencies.add(componentName);
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to parse imports for ${file.path}:`, error);
  }

  // Add internal dependencies for the requested component
  for (const dep of internalDependencies) {
    const packageName = dep.replace('@repo/', '');
    usedRegistryDependencies.add(
      new URL(`/elements/${packageName}.json`, registryUrl).toString()
    );
  }

  const newResponse = {
    ...response,
    files: [file],
    dependencies: Array.from(usedDependencies),
    devDependencies: Array.from(usedDevDependencies),
    registryDependencies: Array.from(usedRegistryDependencies),
  };

  return NextResponse.json(newResponse);
};
