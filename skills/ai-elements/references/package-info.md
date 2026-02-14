# Package Info

Display dependency information and version changes.

The `PackageInfo` component displays package dependency information including version changes and change type badges.

See `scripts/package-info.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add package-info
```

## Features

- Version change display (current → new)
- Color-coded change type badges
- Dependencies list
- Description support

## Change Types

| Type      | Color  | Use Case           |
| --------- | ------ | ------------------ |
| `major`   | Red    | Breaking changes   |
| `minor`   | Yellow | New features       |
| `patch`   | Green  | Bug fixes          |
| `added`   | Blue   | New dependency     |
| `removed` | Gray   | Removed dependency |

## Props

### `<PackageInfo />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Package name. |
| `currentVersion` | `string` | - | Current installed version. |
| `newVersion` | `string` | - | New version being installed. |
| `changeType` | `unknown` | - | Type of version change. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<PackageInfoHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the header div. |

### `<PackageInfoName />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom name content. Defaults to the name from context. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<PackageInfoChangeType />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom change type label. Defaults to the changeType from context. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the Badge component. |

### `<PackageInfoVersion />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom version content. Defaults to version transition display. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<PackageInfoDescription />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLParagraphElement>` | - | Spread to the p element. |

### `<PackageInfoContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<PackageInfoDependencies />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<PackageInfoDependency />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Dependency name. |
| `version` | `string` | - | Dependency version. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the row div. |
