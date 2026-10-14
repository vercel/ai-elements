import { describe, expect, it } from "vitest";

import { parseTypeTableProps, replaceTypeTables } from "./type-table.js";

describe("type table prop parsing", () => {
  it("preserves quoted unions, indexed access types, and object defaults", () => {
    const props = parseTypeTableProps(`
      selectionMode: {
        description: "Whether one or many choices can be selected.",
        type: '"single" | "multiple"',
        default: '"single"',
      },
      onLoad: {
        description: "Called when loading starts.",
        type: 'RiveParameters["onLoad"]',
      },
      defaultValue: {
        description: "The initial draft.",
        type: "QuestionValue",
        default: '{ selectedValues: [], text: "" }',
      },
    `);

    expect(props).toStrictEqual([
      {
        default: '"single"',
        description: "Whether one or many choices can be selected.",
        name: "selectionMode",
        type: '"single" | "multiple"',
      },
      {
        description: "Called when loading starts.",
        name: "onLoad",
        type: 'RiveParameters["onLoad"]',
      },
      {
        default: '{ selectedValues: [], text: "" }',
        description: "The initial draft.",
        name: "defaultValue",
        type: "QuestionValue",
      },
    ]);
  });

  it("preserves required props and quoted property names", () => {
    const props = parseTypeTableProps(`
      "...props": {
        description: "Props forwarded to the input.",
        type: 'Omit<React.ComponentProps<"input">, "value">',
        required: true,
      },
    `);

    expect(props).toStrictEqual([
      {
        description: "Props forwarded to the input.",
        name: "...props",
        required: true,
        type: 'Omit<React.ComponentProps<"input">, "value">',
      },
    ]);
  });
});

describe("type table Markdown replacement", () => {
  it("escapes union separators in Markdown tables", () => {
    const content = `<TypeTable
      type={{
        mode: {
          description: "Choose one | or many.",
          type: '"single" | "multiple"',
        },
      }}
    />`;

    expect(replaceTypeTables(content)).toContain(
      '| `mode` | `"single" \\| "multiple"` | - | Choose one \\| or many. |'
    );
  });
});
