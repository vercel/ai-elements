#!/usr/bin/env node

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

console.log('Adding AI Elements...');

// Check for components.json in the current working directory
const componentsJsonPath = path.join(process.cwd(), 'components.json');
if (!fs.existsSync(componentsJsonPath)) {
  console.error(
    'components.json not found in the current directory. Run `npx shadcn@latest init` to create one.'
  );
  process.exit(1);
}

// Function to detect the command used to invoke this script
function getCommandPrefix() {
  // Check for common package manager environment variables
  if (process.env.npm_config_user_agent) {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent.includes('pnpm')) {
      return 'pnpm dlx';
    }
    if (userAgent.includes('yarn')) {
      return 'yarn dlx';
    }
    if (userAgent.includes('bun')) {
      return 'bunx';
    }
  }

  // Default fallback
  return 'npx -y';
}

const commandPrefix = getCommandPrefix();

// Parse command line arguments
const args = process.argv.slice(2);

// Check if the command is 'add <component>'
if (args.length >= 2 && args[0] === 'add') {
  const component = args[1];
  const targetUrl = new URL(
    `/${component}.json`,
    'https://registry.ai-sdk.dev'
  ).toString();
  console.log(`Adding component: ${component}`);
  execSync(`${commandPrefix} shadcn@latest add ${targetUrl}`);
} else {
  const targetUrl = new URL(
    '/all.json',
    'https://registry.ai-sdk.dev'
  ).toString();

  fetch(targetUrl)
    .then((response) => response.json())
    .then((data) => {
      const components = data.items.filter(
        (item) => item.type === 'registry:component'
      );

      for (const item of components) {
        console.log(`Adding component: ${item.name}`);
        const componentUrl = new URL(
          `/${item.name}.json`,
          'https://registry.ai-sdk.dev'
        ).toString();
        execSync(`${commandPrefix} shadcn@latest add ${componentUrl}`);
      }
    });
}
