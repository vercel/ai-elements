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

// Get all components or default to 'all' if no component is provided
const components = args.length >= 2 ? args.slice(1) : ["all"];

// Get the target URLs for all components
const targetUrls = components
  .map((component) =>
    new URL(`/${component}.json`, "https://registry.ai-sdk.dev").toString()
  )
  .join(" ");

const fullCommand = `${commandPrefix} shadcn@latest add ${targetUrls}`;
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
