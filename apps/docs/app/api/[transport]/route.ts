import { promises as fs, readdirSync } from "node:fs";
import { join } from "node:path";
import { track } from "@vercel/analytics/server";
import { createMcpHandler } from "mcp-handler";
import type { RegistryItem } from "shadcn/schema";
import { z } from "zod/v3";

const packageDir = join(process.cwd(), "..", "..", "packages", "elements");
const srcDir = join(packageDir, "src");
const packageFiles = readdirSync(srcDir, { withFileTypes: true });
const tsxFiles = packageFiles.filter(
  (file) => file.isFile() && file.name.endsWith(".tsx")
);

const componentNames = tsxFiles.map((file) => file.name.replace(".tsx", ""));

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_ai_elements_components",
      {
        title: "Get AI Elements Components",
        description: "Provides a list of all AI Elements components.",
        inputSchema: {},
      },
      async () => {
        if (process.env.NODE_ENV === "production") {
          try {
            await track("MCP: Get components");
          } catch (error) {
            console.error(error);
          }
        }

        return {
          content: [{ type: "text", text: JSON.stringify(componentNames) }],
        };
      }
    );

    server.registerTool(
      "get_ai_elements_component",
      {
        title: "Get AI Elements Component",
        description: "Provides information about an AI Elements component.",
        inputSchema: {
          component: z
            .string()
            .describe(
              `Component name. Available: ${componentNames.join(", ")}`
            ),
        },
      },
      async ({ component }) => {
        const tsxFile = tsxFiles.find(
          (file) => file.name === `${component}.tsx`
        );

        if (!tsxFile) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${component}" not found. Available components: ${componentNames.join(", ")}`,
              },
            ],
          };
        }

        if (process.env.NODE_ENV === "production") {
          try {
            await track("MCP: Get component", {
              component,
            });
          } catch (error) {
            console.error(error);
          }
        }

        // Read the component file
        const filePath = join(srcDir, tsxFile.name);
        const content = await fs.readFile(filePath, "utf-8");
        const parsedContent = content
          .replace(
            /@repo\/shadcn-ui\/components\/ui\//g,
            "@/registry/default/ui/"
          )
          .replace(/@repo\/shadcn-ui\/lib\//g, "@/lib/");

        // Create a registry item for this component
        const componentInfo: RegistryItem = {
          name: component,
          type: "registry:component",
          title: component
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          description: `AI-powered ${component.replace("-", " ")} component.`,
          files: [
            {
              path: `registry/default/ai-elements/${tsxFile.name}`,
              type: "registry:component",
              content: parsedContent,
              target: `components/ai-elements/${tsxFile.name}`,
            },
          ],
        };

        return {
          content: [
            { type: "text", text: JSON.stringify(componentInfo, null, 2) },
          ],
        };
      }
    );
  },
  {},
  {
    disableSse: true,
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
