/** biome-ignore-all lint/suspicious/noConsole: "server only" */

import { promises as fs, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { track } from "@vercel/analytics/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Registry, RegistryItem } from "shadcn/schema";
import { Project } from "ts-morph";

const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
const registryUrl = `${protocol}://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

const packageDir = join(process.cwd(), "..", "..", "packages", "elements");
const packagePath = join(packageDir, "package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf-8"));

const examplesDir = join(
  process.cwd(),
  "..",
  "..",
  "packages",
  "examples",
  "src"
);

const internalDependencies = Object.keys(packageJson.dependencies || {}).filter(
  (dep) => dep.startsWith("@repo") && dep !== "@repo/shadcn-ui"
);

const dependenciesSet = new Set(
  Object.keys(packageJson.dependencies || {}).filter(
    (dep) =>
      ![
        "react",
        "react-dom",
        "@repo/shadcn-ui",
        ...internalDependencies,
      ].includes(dep)
  )
);

const devDependenciesSet = new Set(
  Object.keys(packageJson.devDependencies || {}).filter(
    (dep) =>
      ![
        "@repo/typescript-config",
        "@types/react",
        "@types/react-dom",
        "typescript",
      ].includes(dep)
  )
);

// Registry should auto-add ai sdk v5 as a dependency
dependenciesSet.add("ai");
dependenciesSet.add("@ai-sdk/react");
dependenciesSet.add("zod");

const dependencies = Array.from(dependenciesSet);
const devDependencies = Array.from(devDependenciesSet);

// Normalize to package root (supports scoped and deep subpath imports)
const getBasePackageName = (specifier: string) => {
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/");
    return parts.slice(0, 2).join("/");
  }
  return specifier.split("/")[0];
};

// Build a mapping from runtime package -> its @types devDependency package(s)
const TYPES_PREFIX = "@types/";
const typesDevDepsMap = new Map<string, string[]>();
for (const devDep of devDependencies) {
  if (devDep.startsWith(TYPES_PREFIX)) {
    const name = devDep.slice(TYPES_PREFIX.length);
    // Scoped packages in DefinitelyTyped use __ separator, e.g. @types/babel__core for @babel/core
    const runtime = name.includes("__") ? name.replace("__", "/") : name;
    const list = typesDevDepsMap.get(runtime) ?? [];
    list.push(devDep);
    typesDevDepsMap.set(runtime, list);
  }
}

const srcDir = join(packageDir, "src");

const packageFiles = readdirSync(srcDir, { withFileTypes: true });
const tsxFiles = packageFiles.filter(
  (file) => file.isFile() && file.name.endsWith(".tsx")
);

const exampleFiles = readdirSync(examplesDir, { withFileTypes: true });
const exampleTsxFiles = exampleFiles.filter(
  (file) => file.isFile() && file.name.endsWith(".tsx")
);

const files: {
  type: string;
  path: string;
  content: string;
}[] = [];

const fileContents = await Promise.all(
  tsxFiles.map(async (tsxFile) => {
    const filePath = join(srcDir, tsxFile.name);
    const content = await fs.readFile(filePath, "utf-8");
    const parsedContent = content.replace(/@repo\/shadcn-ui\//g, "@/");

    return {
      type: "registry:component",
      path: `registry/default/ai-elements/${tsxFile.name}`,
      content: parsedContent,
    };
  })
);

const exampleContents = await Promise.all(
  exampleTsxFiles.map(async (exampleFile) => {
    const filePath = join(examplesDir, exampleFile.name);
    const content = await fs.readFile(filePath, "utf-8");
    const parsedContent = content
      .replace(/@repo\/shadcn-ui\//g, "@/")
      .replace(/@repo\/elements\//g, "@/components/ai-elements/");

    return {
      type: "registry:block",
      path: `registry/default/examples/${exampleFile.name}`,
      content: parsedContent,
    };
  })
);

files.push(...fileContents, ...exampleContents);

const registryDependenciesSet = new Set<string>();

// Extract shadcn/ui components from file content
const shadcnComponents =
  files
    .map((f) => f.content)
    .join("\n")
    .match(/@\/components\/ui\/([a-z-]+)/g)
    ?.map((path) => path.split("/").pop())
    .filter((name): name is string => Boolean(name)) || [];

// Extract AI element components from file content
const aiElementComponents =
  files
    .map((f) => f.content)
    .join("\n")
    .match(/@\/components\/ai-elements\/([a-z-]+)/g)
    ?.map((path) => path.split("/").pop())
    .filter((name): name is string => Boolean(name)) || [];

// Add shadcn/ui components to set
for (const component of shadcnComponents) {
  registryDependenciesSet.add(component);
}

// Add AI element components to set (these become registry dependencies)
for (const component of aiElementComponents) {
  registryDependenciesSet.add(component);
}

// Create items for the root registry response
const componentItems: RegistryItem[] = tsxFiles.map((componentFile) => {
  const componentName = componentFile.name.replace(".tsx", "");

  const item: RegistryItem = {
    name: componentName,
    type: "registry:component",
    title: componentName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: `AI-powered ${componentName.replace("-", " ")} component.`,
    files: [
      {
        path: `registry/default/ai-elements/${componentFile.name}`,
        type: "registry:component",
        target: `components/ai-elements/${componentFile.name}.tsx`,
      },
    ],
  };

  return item;
});

const exampleItems: RegistryItem[] = exampleTsxFiles.map((exampleFile) => {
  const exampleName = exampleFile.name.replace(".tsx", "");

  const item: RegistryItem = {
    name: `example-${exampleName}`,
    type: "registry:block",
    title: `${exampleName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")} Example`,
    description: `Example implementation of ${exampleName.replace("-", " ")}.`,
    files: [
      {
        path: `registry/default/examples/${exampleFile.name}`,
        type: "registry:block",
        target: `components/ai-elements/examples/${exampleFile.name}.tsx`,
      },
    ],
  };

  return item;
});

const items: RegistryItem[] = [...componentItems, ...exampleItems];

const response: Registry = {
  name: "ai-elements",
  homepage: new URL("/elements", registryUrl).toString(),
  items,
};

type RequestProps = {
  params: Promise<{ component: string }>;
};

export const GET = async (_request: NextRequest, { params }: RequestProps) => {
  const { component } = await params;
  const parsedComponent = component.replace(".json", "");

  if (parsedComponent === "registry") {
    try {
      track("registry:registry");
    } catch (error) {
      console.warn("Failed to track registry:registry:", error);
    }
    return NextResponse.json(response);
  }

  // Handle "all.json" - bundle all components into a single RegistryItem
  if (parsedComponent === "all") {
    try {
      track("registry:all");
    } catch (error) {
      console.warn("Failed to track registry:all:", error);
    }

    // Collect all dependencies and registry dependencies from all components
    const allDependencies = new Set<string>();
    const allDevDependencies = new Set<string>();
    const allRegistryDependencies = new Set<string>();
    const allFiles: RegistryItem["files"] = [];

    // Process each component file
    for (const componentFile of tsxFiles) {
      const file = files.find(
        (f) => f.path === `registry/default/ai-elements/${componentFile.name}`
      );

      if (file) {
        allFiles.push({
          path: file.path,
          type: file.type as RegistryItem["type"],
          content: file.content,
          target: `components/ai-elements/${componentFile.name}`,
        });

        // Parse imports for dependencies
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

            const pkg = getBasePackageName(moduleName);
            // Check if it's a regular dependency
            if (dependencies.includes(pkg)) {
              allDependencies.add(pkg);
              // Check if it has a corresponding @types/ package
              const typePkgs = typesDevDepsMap.get(pkg);
              if (typePkgs) {
                for (const t of typePkgs) {
                  allDevDependencies.add(t);
                }
              }
            }

            // Check if it's a dev dependency
            if (devDependencies.includes(moduleName)) {
              allDevDependencies.add(moduleName);
            }

            // Check if it's a registry dependency (shadcn/ui components)
            if (moduleName.startsWith("@/components/ui/")) {
              const componentName = moduleName.split("/").pop();
              if (componentName) {
                allRegistryDependencies.add(componentName);
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to parse imports for ${file.path}:`, error);
        }
      }
    }

    const allComponentsItem: RegistryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "all",
      type: "registry:component",
      title: "All AI Elements",
      description: "Bundle containing all AI-powered components.",
      files: allFiles,
      dependencies: Array.from(allDependencies),
      devDependencies: Array.from(allDevDependencies),
      registryDependencies: Array.from(allRegistryDependencies),
    };

    return NextResponse.json(allComponentsItem);
  }

  try {
    track(`registry:${parsedComponent}`);
  } catch (error) {
    console.warn(`Failed to track ${parsedComponent}:`, error);
  }

  // Only process the parsedComponent, not an array

  // Find the item for the requested component or example
  const item = response.items.find((i) => i.name === parsedComponent);

  if (!item) {
    return NextResponse.json(
      { error: `Component "${parsedComponent}" not found.` },
      { status: 404 }
    );
  }

  // Find the corresponding file content
  let file: { type: string; path: string; content: string } | undefined;
  if (item.type === "registry:component") {
    file = files.find(
      (f) => f.path === `registry/default/ai-elements/${parsedComponent}.tsx`
    );
  } else if (
    item.type === "registry:block" &&
    parsedComponent.startsWith("example-")
  ) {
    const exampleFileName = `${parsedComponent.replace("example-", "")}.tsx`;
    file = files.find(
      (f) => f.path === `registry/default/examples/${exampleFileName}`
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: `File for "${parsedComponent}" not found.` },
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
      if (moduleName.startsWith("./")) {
        const relativePath = moduleName.split("/").pop();
        if (relativePath) {
          usedRegistryDependencies.add(
            new URL(`/${relativePath}.json`, registryUrl).toString()
          );
        }
      }

      const pkg = getBasePackageName(moduleName);
      // Check if it's a regular dependency
      if (dependencies.includes(pkg)) {
        usedDependencies.add(pkg);
        // Check if it has a corresponding @types/ package
        const typePkgs = typesDevDepsMap.get(pkg);
        if (typePkgs) {
          for (const t of typePkgs) {
            usedDevDependencies.add(t);
          }
        }
      }

      // Check if it's a dev dependency (though less common in component files)
      if (devDependencies.includes(moduleName)) {
        usedDevDependencies.add(moduleName);
      }

      // Check if it's a registry dependency (shadcn/ui components)
      if (moduleName.startsWith("@/components/ui/")) {
        const componentName = moduleName.split("/").pop();
        if (componentName) {
          usedRegistryDependencies.add(componentName);
        }
      }

      // Check if it's an AI element dependency
      if (moduleName.startsWith("@/components/ai-elements/")) {
        const componentName = moduleName.split("/").pop();
        if (componentName) {
          usedRegistryDependencies.add(
            new URL(`/${componentName}.json`, registryUrl).toString()
          );
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to parse imports for ${file.path}:`, error);
  }

  // Add internal dependencies for the requested component
  for (const dep of internalDependencies) {
    const packageName = dep.replace("@repo/", "");
    usedRegistryDependencies.add(
      new URL(`/elements/${packageName}.json`, registryUrl).toString()
    );
  }

  const itemResponse: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    files: [
      {
        path: file.path,
        type: file.type as RegistryItem["type"],
        content: file.content,
        target: `components/ai-elements/${item.name}.tsx`,
      },
    ],
    dependencies: Array.from(usedDependencies),
    devDependencies: Array.from(usedDevDependencies),
    registryDependencies: Array.from(usedRegistryDependencies),
  };

  return NextResponse.json(itemResponse);
};
