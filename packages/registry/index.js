#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

// Function to detect the command used to invoke this script
function getCommandPrefix() {
  // Check for common package manager environment variables
  if (process.env.npm_config_user_agent) {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent.includes("pnpm")) {
      return "pnpm dlx";
    }
    if (userAgent.includes("yarn")) {
      return "yarn dlx";
    }
    if (userAgent.includes("bun")) {
      return "bunx";
    }
  }

  // Default fallback
  return "npx -y";
}

const commandPrefix = getCommandPrefix();

// Parse command line arguments
const args = process.argv.slice(2);

// Set the path as 'all' if no component is provided
const component = args.length >= 2 ? args[1] : "all";

// Get the target URL
const targetUrl = new URL(
  `/${component}.json`,
  "https://registry.ai-sdk.dev"
).toString();

// Handle different component types
if (component === "all") {
  // For "all", fetch the registry and install all components
  fetch(targetUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Validate the response structure
      if (!data || !data.items || !Array.isArray(data.items)) {
        console.error("Error: Invalid registry response structure");
        console.error("Expected registry.json to contain an 'items' array");
        process.exit(1);
      }

      const components = data.items.filter(
        (item) => item.type === "registry:component"
      );

      if (components.length === 0) {
        console.log("No components found in the registry");
        process.exit(0);
      }

      const componentUrls = components.map((item) =>
        new URL(`/${item.name}.json`, "https://registry.ai-sdk.dev").toString()
      );

      const fullCommand = `${commandPrefix} shadcn@latest add ${componentUrls.join(" ")}`;
      const result = spawnSync(fullCommand, {
        stdio: "inherit",
        shell: true,
      });

      if (result.error) {
        console.error("Failed to execute command:", result.error.message);
        process.exit(1);
      } else if (result.status !== 0) {
        console.error(`Command failed with exit code ${result.status}`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Error fetching registry data:", error.message);
      console.error("Please check your internet connection and try again");
      process.exit(1);
    });
} else {
  // For specific components, use the direct approach
  const fullCommand = `${commandPrefix} shadcn@latest add ${targetUrl}`;
  const result = spawnSync(fullCommand, {
    stdio: "inherit",
    shell: true,
  });

  if (result.error) {
    console.error("Failed to execute command:", result.error.message);
    process.exit(1);
  } else if (result.status !== 0) {
    console.error(`Command failed with exit code ${result.status}`);
    process.exit(1);
  }
}
