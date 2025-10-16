# Contributing to AI Elements

Thank you for your interest in contributing to AI Elements! This document outlines the process for contributing to the project.

## About This Project

AI Elements is a component library built on top of shadcn/ui to help developers build AI-native applications faster. The library provides pre-built, customizable React components specifically designed for AI applications, including conversations, messages, code blocks, reasoning displays, and more.

## Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Fix issues in existing components
- **New components** - Add new AI-focused components to the library
- **Component improvements** - Enhance existing components with new features or better APIs
- **Documentation improvements** - Fix typos, clarify explanations, improve examples
- **Tests** - Add or improve component tests
- **Examples** - Add or improve usage examples
- **Accessibility improvements** - Enhance component accessibility

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (this project uses pnpm workspaces)
- Familiarity with React/TypeScript
- Understanding of shadcn/ui and Tailwind CSS
- Knowledge of AI SDK patterns (helpful but not required)

### Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ai-elements.git`
3. Install dependencies: `pnpm install`
4. Create a new branch: `git checkout -b feature/your-contribution`
5. Start the dev server: `pnpm dev`
6. Make your changes and preview at [http://localhost:3000](http://localhost:3000)

## Making Changes

### Component Development

Components are located in `packages/elements/src/`. When developing:

- Follow React and TypeScript best practices
- Ensure components work with the AI SDK
- Use shadcn/ui components as building blocks
- Maintain composability and flexibility
- Include proper TypeScript types
- Test your components with `pnpm test`
- Add tests for new functionality

### Documentation Content

Documentation lives in `apps/docs/content/docs/` as MDX files. When editing:

- Follow the existing tone and style (clear and practical)
- Include code examples showing real-world usage
- Add proper frontmatter (title, description)
- Link to related components and sections
- Show integration with AI SDK when relevant

### Code Examples

When adding code examples:

- Use TypeScript with proper types
- Show realistic AI SDK integration (useChat, useCompletion, etc.)
- Ensure examples are self-contained and runnable
- Include comments explaining key concepts
- Demonstrate component composition patterns
- Keep examples minimal but practical

### Code Style

- The project uses [Ultracite](https://ultracite.dev) (which includes Biome) for linting and formatting
- Run `pnpm run check` before committing to check for issues
- Run `pnpm run fix` to auto-fix formatting issues
- Follow existing component patterns and conventions
- Use semantic HTML in components
- Follow Tailwind CSS conventions for styling

## Pull Request Guidelines

1. **Ensure your PR has a clear purpose**
   - Fix a specific issue or add defined value
   - Reference related issues if applicable

2. **Write a descriptive PR description**
   - Explain what changes you made and why
   - Include before/after comparisons for UI changes
   - Note any breaking changes or impacts
   - Add screenshots/videos for visual changes

3. **Keep changes focused**
   - One feature or fix per PR
   - Don't mix unrelated changes

4. **Follow the project's philosophy**
   - Components should be composable and flexible
   - Maintain compatibility with AI SDK patterns
   - Prioritize accessibility and user experience
   - Keep components customizable (follow shadcn/ui philosophy)

5. **Update related documentation**
   - Add or update component documentation in `apps/docs/content/docs/`
   - Include usage examples
   - Document all props and component APIs
   - Update navigation if adding new components

6. **Test your changes**
   - Run `pnpm test` to ensure all tests pass
   - Add tests for new functionality
   - Preview the documentation site locally
   - Test components with different AI SDK hooks
   - Test responsive behavior

## Commit Messages

Write clear, descriptive commit messages:

- Use conventional commit format when applicable
- Keep the first line under 72 characters
- Provide additional context in the body if needed
- Examples:
  - `feat: add reasoning component`
  - `fix: resolve message overflow in conversation`
  - `docs: update prompt-input examples`
  - `test: add tests for code-block component`

## Reporting Issues

When reporting issues:

1. Check if the issue already exists
2. Use a clear, descriptive title
3. Provide context:
   - Which component is affected?
   - What behavior did you expect?
   - What actually happened?
4. For bugs:
   - Include steps to reproduce
   - Share code snippets or minimal reproduction
   - Include environment details (Node version, framework, etc.)
5. For feature requests:
   - Explain the use case
   - Describe the desired API or behavior
   - Share examples or mockups if applicable

## Style Guide

### Component Design Principles

- **Composability**: Components should work well together and be easily composable
- **Flexibility**: Provide sensible defaults but allow customization
- **Accessibility**: Follow WCAG 2.1 AA guidelines as a baseline
- **AI-First**: Design components with AI SDK patterns in mind
- **shadcn/ui Philosophy**: Components should be copy-paste friendly and customizable

### Technical Guidelines

- Use TypeScript for all component code
- Export proper TypeScript types for all props
- Follow React best practices (hooks, composition, etc.)
- Use Tailwind CSS for styling with CSS variables
- Ensure components work with Server Components where applicable
- Test components with Vitest and React Testing Library

## Questions or Need Help?

- Open an issue for questions about contributing
- Check existing issues and discussions
- Review the documentation at [ai-sdk.dev/elements](https://ai-sdk.dev/elements)
- Reach out to maintainers if you need guidance

## Code of Conduct

This project follows a Code of Conduct. By participating, you agree to uphold professional, respectful, and inclusive behavior.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

## Recognition

Contributors will be recognized in the project. Significant contributions may be highlighted in release notes.

Thank you for helping make AI Elements better for the community!
