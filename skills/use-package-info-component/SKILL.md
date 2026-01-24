---
name: Using the PackageInfo component from AI Elements
description: How to use the PackageInfo component to display package version updates and dependency information.
---

# PackageInfo Component

A composable card component for displaying package version information, change types, and dependencies. Useful for showing package updates in AI-driven dependency management.

## Import

```tsx
import {
  PackageInfo,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoChangeType,
  PackageInfoVersion,
  PackageInfoDescription,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
} from "@repo/elements/package-info";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `PackageInfo` | Root container with context provider |
| `PackageInfoHeader` | Header section for name and change type |
| `PackageInfoName` | Displays package name with icon |
| `PackageInfoChangeType` | Badge showing change type (major/minor/patch/added/removed) |
| `PackageInfoVersion` | Displays current and new version with arrow |
| `PackageInfoDescription` | Package description text |
| `PackageInfoContent` | Content section for additional info |
| `PackageInfoDependencies` | Container for dependency list |
| `PackageInfoDependency` | Individual dependency item |

## Basic Usage

```tsx
import {
  PackageInfo,
  PackageInfoChangeType,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoVersion,
} from "@repo/elements/package-info";

const Example = () => (
  <PackageInfo
    name="react"
    currentVersion="18.2.0"
    newVersion="19.0.0"
    changeType="major"
  >
    <PackageInfoHeader>
      <PackageInfoName />
      <PackageInfoChangeType />
    </PackageInfoHeader>
    <PackageInfoVersion />
    <PackageInfoDescription>
      A JavaScript library for building user interfaces.
    </PackageInfoDescription>
    <PackageInfoContent>
      <PackageInfoDependencies>
        <PackageInfoDependency name="react-dom" version="^19.0.0" />
        <PackageInfoDependency name="scheduler" version="^0.24.0" />
      </PackageInfoDependencies>
    </PackageInfoContent>
  </PackageInfo>
);
```

## Props Reference

### `<PackageInfo />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Package name (required) |
| `currentVersion` | `string` | - | Current version number |
| `newVersion` | `string` | - | New version number |
| `changeType` | `"major" \| "minor" \| "patch" \| "added" \| "removed"` | - | Type of version change |
| `className` | `string` | - | Additional CSS classes |

### `<PackageInfoDependency />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Dependency name (required) |
| `version` | `string` | - | Dependency version |

## Change Type Styles

- `major` - Red badge with arrow icon
- `minor` - Yellow badge with arrow icon
- `patch` - Green badge with arrow icon
- `added` - Blue badge with plus icon
- `removed` - Gray badge with minus icon

## Examples

See `scripts/` folder for complete working examples.
