/** biome-ignore-all lint/suspicious/noConsole: "server only" */

import { promises as fs, readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { track } from '@vercel/analytics/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Project } from 'ts-morph';

type RegistryItemSchema = {
  name: string;
  type:
    | 'registry:lib'
    | 'registry:block'
    | 'registry:component'
    | 'registry:ui'
    | 'registry:hook'
    | 'registry:theme'
    | 'registry:page'
    | 'registry:file'
    | 'registry:style'
    | 'registry:item';
  description?: string;
  title?: string;
  author?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: {
    path?: string;
    content?: string;
    type?:
      | 'registry:lib'
      | 'registry:block'
      | 'registry:component'
      | 'registry:ui'
      | 'registry:hook'
      | 'registry:theme'
      | 'registry:page'
      | 'registry:file'
      | 'registry:style'
      | 'registry:item';
    target?: string;
    [k: string]: unknown;
  }[];
  tailwind?: {
    config?: {
      content?: string[];
      theme?: {
        [k: string]: unknown;
      };
      plugins?: string[];
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  cssVars?: {
    theme?: {
      [k: string]: string;
    };
    light?: {
      [k: string]: string;
    };
    dark?: {
      [k: string]: string;
    };
    [k: string]: unknown;
  };
  css?: {
    [k: string]:
      | string
      | {
          [k: string]:
            | string
            | {
                /**
                 * CSS property value for nested rule
                 */
                [k: string]: string;
              };
        };
  };
  envVars?: {
    [k: string]: string;
  };
  meta?: {
    [k: string]: unknown;
  };
  docs?: string;
  categories?: string[];
  extends?: string;
};

type RegistrySchema = {
  $schema: 'https://ui.shadcn.com/schema/registry.json';
  name: string;
  homepage: string;
  items: RegistryItemSchema[];
};

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
}[] = [];

const fileContents = await Promise.all(
  tsxFiles.map(async (file) => {
    const filePath = join(srcDir, file.name);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsedContent = content.replace(/@repo\/shadcn-ui\//g, '@/');

    return {
      type: 'registry:component',
      path: `registry/default/ai-elements/${file.name}`,
      content: parsedContent,
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

// Create items for the root registry response
const items: RegistryItemSchema[] = tsxFiles.map((file) => {
  const componentName = file.name.replace('.tsx', '');

  const item: RegistryItemSchema = {
    name: componentName,
    type: 'registry:component',
    title: componentName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: `AI-powered ${componentName.replace('-', ' ')} component.`,
    files: [
      {
        path: `registry/default/ai-elements/${file.name}`,
        type: 'registry:component',
      },
    ],
  };

  return item;
});

const response: RegistrySchema = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'ai-elements',
  homepage: new URL('/elements', registryUrl).toString(),
  items,
};

type RequestProps = {
  params: Promise<{ component: string }>;
};

export const GET = async (_request: NextRequest, { params }: RequestProps) => {
  const { component } = await params;
  const parsedComponent = component.replace('.json', '');

  if (parsedComponent === 'all' || parsedComponent === 'registry') {
    try {
      track('registry:all');
    } catch (error) {
      console.warn('Failed to track registry:all:', error);
    }
    return NextResponse.json(response);
  }

  try {
    track(`registry:${parsedComponent}`);
  } catch (error) {
    console.warn(`Failed to track ${parsedComponent}:`, error);
  }

  // Only process the parsedComponent, not an array

  // Find the item for the requested component
  const item = response.items.find((i) => i.name === parsedComponent);

  if (!item) {
    return NextResponse.json(
      { error: `Component "${parsedComponent}" not found.` },
      { status: 404 }
    );
  }

  // Find the corresponding file content
  const file = files.find(
    (f) => f.path === `registry/default/ai-elements/${parsedComponent}.tsx`
  );

  if (!file) {
    return NextResponse.json(
      { error: `Component file "${parsedComponent}" not found.` },
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
      if (!moduleName) {
        continue;
      }

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

  const itemResponse = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    files: [
      {
        path: file.path,
        type: file.type,
        content: file.content,
      },
    ],
    dependencies: Array.from(usedDependencies),
    devDependencies: Array.from(usedDevDependencies),
    registryDependencies: Array.from(usedRegistryDependencies),
  };

  return NextResponse.json(itemResponse);
};
