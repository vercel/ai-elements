import ts from "typescript";

export interface TypeTableProp {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string;
}

const getPropertyName = (name: ts.PropertyName): string | undefined => {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text;
  }

  return undefined;
};

const getStringValue = (expression: ts.Expression): string | undefined => {
  if (
    ts.isStringLiteral(expression) ||
    ts.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return expression.text;
  }

  return undefined;
};

export const parseTypeTableProps = (typeContent: string): TypeTableProp[] => {
  const sourceFile = ts.createSourceFile(
    "type-table.ts",
    `const typeTable = {${typeContent}};`,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );
  const statement = sourceFile.statements.find(ts.isVariableStatement);
  const initializer = statement?.declarationList.declarations[0]?.initializer;

  if (!initializer || !ts.isObjectLiteralExpression(initializer)) {
    return [];
  }

  return initializer.properties.flatMap((property) => {
    if (
      !ts.isPropertyAssignment(property) ||
      !ts.isObjectLiteralExpression(property.initializer)
    ) {
      return [];
    }

    const name = getPropertyName(property.name);
    if (!name) {
      return [];
    }

    const prop: TypeTableProp = {
      description: "",
      name,
      type: "unknown",
    };

    for (const field of property.initializer.properties) {
      if (!ts.isPropertyAssignment(field)) {
        continue;
      }

      const fieldName = getPropertyName(field.name);
      if (fieldName === "description") {
        prop.description = getStringValue(field.initializer) ?? "";
      } else if (fieldName === "type") {
        prop.type = getStringValue(field.initializer) ?? "unknown";
      } else if (fieldName === "default") {
        prop.default = getStringValue(field.initializer);
      } else if (fieldName === "required") {
        prop.required = field.initializer.kind === ts.SyntaxKind.TrueKeyword;
      }
    }

    return [prop];
  });
};

const escapeTableCell = (value: string): string =>
  value.replaceAll("|", "\\|").replaceAll(/\r?\n/g, " ");

export const replaceTypeTables = (content: string): string => {
  const typeTableRegex = /<TypeTable\s+type=\{\{([\s\S]*?)\}\}\s*\/>/g;

  return content.replace(typeTableRegex, (_, typeContent: string) => {
    const props = parseTypeTableProps(typeContent);

    if (props.length === 0) {
      return "";
    }

    const rows = props.map((prop) => {
      const name = `\`${escapeTableCell(prop.name)}\``;
      const type = `\`${escapeTableCell(prop.type)}\``;
      let defaultValue = "-";
      if (prop.required) {
        defaultValue = "Required";
      } else if (prop.default) {
        defaultValue = `\`${escapeTableCell(prop.default)}\``;
      }
      return `| ${name} | ${type} | ${defaultValue} | ${escapeTableCell(prop.description)} |`;
    });

    return [
      "| Prop | Type | Default | Description |",
      "|------|------|---------|-------------|",
      ...rows,
    ].join("\n");
  });
};
