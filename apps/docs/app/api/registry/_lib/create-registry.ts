/** biome-ignore-all lint/suspicious/noConsole: "server only" */

import type { NextRequest } from "next/server";
import type { Registry, RegistryItem } from "shadcn/schema";

import { track } from "@vercel/analytics/server";
import { NextResponse } from "next/server";
import { promises as fs, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Project } from "ts-morph";

const getRegistryUrl = (request: NextRequest) => {
  const host = request.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
};

// Normalize to package root (supports scoped and deep subpath imports)
const getBasePackageName = (specifier: string) => {
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/");
    return parts.slice(0, 2).join("/");
  }
  return specifier.split("/")[0];
};

interface RegistryConfig {
  /** Name of the elements package directory, e.g. "elements" or "elements-base" */
  elementsPackage: string;
  /** Name of the shadcn-ui package to exclude from deps, e.g. "@repo/shadcn-ui" or "@repo/base-ui" */
  uiPackageName: string;
  /** Registry path style prefix used in file paths, e.g. "default" or "base" */
  registryStyle: string;
  /** Import path prefix for UI components in output, e.g. "@/registry/default/ui/" */
  uiImportPrefix: string;
  /** Import path prefix for utils in output, e.g. "@/lib/" */
  utilsImportPrefix: string;
  /** Base path for the registry API, e.g. "/api/registry" or "/api/registry/base" */
  apiBasePath: string;
  /** Name of the examples package directory, e.g. "examples" or "examples-base" */
  examplesPackage: string;
}

export async function createRegistryHandler(config: RegistryConfig) {
  const {
    elementsPackage,
    uiPackageName,
    registryStyle,
    uiImportPrefix,
    utilsImportPrefix,
    apiBasePath,
    examplesPackage,
  } = config;

  const packageDir = join(process.cwd(), "..", "..", "packages", elementsPackage);
  const packagePath = join(packageDir, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));

  const examplesDir = join(
    process.cwd(),
    "..",
    "..",
    "packages",
    examplesPackage,
    "src"
  );

  const internalDependencies = Object.keys(packageJson.dependencies || {}).filter(
    (dep) => dep.startsWith("@repo") && dep !== uiPackageName
  );

  const dependenciesSet = new Set(
    Object.keys(packageJson.dependencies || {}).filter(
      (dep) =>
        ![
          "react",
          "react-dom",
          uiPackageName,
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

  const dependencies = new Set(dependenciesSet);
  const devDependencies = [...devDependenciesSet];

  // Build a mapping from runtime package -> its @types devDependency package(s)
  const TYPES_PREFIX = "@types/";
  const typesDevDepsMap = new Map<string, string[]>();
  for (const devDep of devDependencies) {
    if (devDep.startsWith(TYPES_PREFIX)) {
      const name = devDep.slice(TYPES_PREFIX.length);
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

  const uiSourceImport = `${uiPackageName}/components/ui/`;
  const libSourceImport = `${uiPackageName}/lib/`;
  const elementsSourceImport = elementsPackage === "elements" ? "@repo/elements/" : "@repo/elements-base/";

  const files: {
    type: string;
    path: string;
    content: string;
  }[] = [];

  const fileContents = await Promise.all(
    tsxFiles.map(async (tsxFile) => {
      const filePath = join(srcDir, tsxFile.name);
      const content = await fs.readFile(filePath, "utf8");
      const parsedContent = content
        .replaceAll(uiSourceImport, uiImportPrefix)
        .replaceAll(libSourceImport, utilsImportPrefix);

      return {
        content: parsedContent,
        path: `registry/${registryStyle}/ai-elements/${tsxFile.name}`,
        type: "registry:component",
      };
    })
  );

  const exampleContents = await Promise.all(
    exampleTsxFiles.map(async (exampleFile) => {
      const filePath = join(examplesDir, exampleFile.name);
      const content = await fs.readFile(filePath, "utf8");
      const parsedContent = content
        .replaceAll(uiSourceImport, uiImportPrefix)
        .replaceAll(libSourceImport, utilsImportPrefix)
        .replaceAll(elementsSourceImport, "@/components/ai-elements/");

      return {
        content: parsedContent,
        path: `registry/${registryStyle}/examples/${exampleFile.name}`,
        type: "registry:block",
      };
    })
  );

  files.push(...fileContents, ...exampleContents);

  // Create items for the root registry response
  const componentItems: RegistryItem[] = tsxFiles.map((componentFile) => {
    const componentName = componentFile.name.replace(".tsx", "");

    const item: RegistryItem = {
      description: `AI-powered ${componentName.replace("-", " ")} component.`,
      files: [
        {
          path: `registry/${registryStyle}/ai-elements/${componentFile.name}`,
          target: `components/ai-elements/${componentFile.name}.tsx`,
          type: "registry:component",
        },
      ],
      name: componentName,
      title: componentName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      type: "registry:component",
    };

    return item;
  });

  const exampleItems: RegistryItem[] = exampleTsxFiles.map((exampleFile) => {
    const exampleName = exampleFile.name.replace(".tsx", "");

    const item: RegistryItem = {
      description: `Example implementation of ${exampleName.replace("-", " ")}.`,
      files: [
        {
          path: `registry/${registryStyle}/examples/${exampleFile.name}`,
          target: `components/ai-elements/examples/${exampleFile.name}.tsx`,
          type: "registry:block",
        },
      ],
      name: `example-${exampleName}`,
      title: `${exampleName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} Example`,
      type: "registry:block",
    };

    return item;
  });

  const items: RegistryItem[] = [...componentItems, ...exampleItems];

  return {
    items,
    tsxFiles,
    files,
    dependencies,
    devDependencies,
    typesDevDepsMap,
    internalDependencies,
    getRegistryUrl,
    getBasePackageName,
    registryStyle,
    apiBasePath,
  };
}

interface RequestProps {
  params: Promise<{ component: string }>;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Registry route requires handling many component cases
export function createRegistryGET(registryPromise: ReturnType<typeof createRegistryHandler>) {
  return async (request: NextRequest, { params }: RequestProps) => {
    const registry = await registryPromise;
    const {
      items,
      tsxFiles,
      files,
      dependencies,
      devDependencies,
      typesDevDepsMap,
      internalDependencies,
      getRegistryUrl: getUrl,
      getBasePackageName: getBasePkg,
      registryStyle,
      apiBasePath,
    } = registry;

    const { component } = await params;
    const parsedComponent = component.replace(".json", "");
    const registryUrl = getUrl(request);

    const getResponse = (): Registry => ({
      homepage: new URL("/elements", registryUrl).toString(),
      items,
      name: "ai-elements",
    });

    if (parsedComponent === "registry") {
      try {
        track(`registry:${registryStyle}:registry`);
      } catch (error) {
        console.warn("Failed to track registry:", error);
      }
      return NextResponse.json(getResponse());
    }

    // Handle "all.json" - bundle all components into a single RegistryItem
    if (parsedComponent === "all") {
      try {
        track(`registry:${registryStyle}:all`);
      } catch (error) {
        console.warn("Failed to track registry:all:", error);
      }

      const allDependencies = new Set<string>();
      const allDevDependencies = new Set<string>();
      const allRegistryDependencies = new Set<string>();
      const allFiles: RegistryItem["files"] = [];

      for (const componentFile of tsxFiles) {
        const file = files.find(
          (f) => f.path === `registry/${registryStyle}/ai-elements/${componentFile.name}`
        );

        if (file) {
          allFiles.push({
            content: file.content,
            path: file.path,
            target: `components/ai-elements/${componentFile.name}`,
            type: file.type as RegistryItem["type"],
          });

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

              const pkg = getBasePkg(moduleName);
              if (dependencies.has(pkg)) {
                allDependencies.add(pkg);
                const typePkgs = typesDevDepsMap.get(pkg);
                if (typePkgs) {
                  for (const t of typePkgs) {
                    allDevDependencies.add(t);
                  }
                }
              }

              if (devDependencies.includes(moduleName)) {
                allDevDependencies.add(moduleName);
              }

              if (moduleName.startsWith(`@/registry/${registryStyle}/ui/`)) {
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
        dependencies: [...allDependencies],
        description: "Bundle containing all AI-powered components.",
        devDependencies: [...allDevDependencies],
        files: allFiles,
        name: "all",
        registryDependencies: [...allRegistryDependencies],
        title: "All AI Elements",
        type: "registry:component",
      };

      return NextResponse.json(allComponentsItem);
    }

    try {
      track(`registry:${registryStyle}:${parsedComponent}`);
    } catch (error) {
      console.warn(`Failed to track ${parsedComponent}:`, error);
    }

    const response = getResponse();
    const item = response.items.find((i) => i.name === parsedComponent);

    if (!item) {
      return NextResponse.json(
        { error: `Component "${parsedComponent}" not found.` },
        { status: 404 }
      );
    }

    let file: { type: string; path: string; content: string } | undefined;
    if (item.type === "registry:component") {
      file = files.find(
        (f) => f.path === `registry/${registryStyle}/ai-elements/${parsedComponent}.tsx`
      );
    } else if (
      item.type === "registry:block" &&
      parsedComponent.startsWith("example-")
    ) {
      const exampleFileName = `${parsedComponent.replace("example-", "")}.tsx`;
      file = files.find(
        (f) => f.path === `registry/${registryStyle}/examples/${exampleFileName}`
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: `File for "${parsedComponent}" not found.` },
        { status: 404 }
      );
    }

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

        if (moduleName.startsWith("./")) {
          const relativePath = moduleName.split("/").pop();
          if (relativePath) {
            usedRegistryDependencies.add(
              new URL(
                `${apiBasePath}/${relativePath}.json`,
                registryUrl
              ).toString()
            );
          }
        }

        const pkg = getBasePkg(moduleName);
        if (dependencies.has(pkg)) {
          usedDependencies.add(pkg);
          const typePkgs = typesDevDepsMap.get(pkg);
          if (typePkgs) {
            for (const t of typePkgs) {
              usedDevDependencies.add(t);
            }
          }
        }

        if (devDependencies.includes(moduleName)) {
          usedDevDependencies.add(moduleName);
        }

        if (moduleName.startsWith(`@/registry/${registryStyle}/ui/`)) {
          const componentName = moduleName.split("/").pop();
          if (componentName) {
            usedRegistryDependencies.add(componentName);
          }
        }

        if (moduleName.startsWith("@/components/ai-elements/")) {
          const componentName = moduleName.split("/").pop();
          if (componentName) {
            usedRegistryDependencies.add(
              new URL(`${apiBasePath}/${componentName}.json`, registryUrl).toString()
            );
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to parse imports for ${file.path}:`, error);
    }

    for (const dep of internalDependencies) {
      const packageName = dep.replace("@repo/", "");
      usedRegistryDependencies.add(
        new URL(`/elements/${packageName}.json`, registryUrl).toString()
      );
    }

    const itemResponse: RegistryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      dependencies: [...usedDependencies],
      description: item.description,
      devDependencies: [...usedDevDependencies],
      files: [
        {
          content: file.content,
          path: file.path,
          target: `components/ai-elements/${item.name}.tsx`,
          type: file.type as Exclude<
            RegistryItem["type"],
            "registry:base" | "registry:font"
          >,
        },
      ],
      name: item.name,
      registryDependencies: [...usedRegistryDependencies],
      title: item.title,
      type: item.type as Exclude<
        RegistryItem["type"],
        "registry:base" | "registry:font"
      >,
    };

    return NextResponse.json(itemResponse);
  };
}
