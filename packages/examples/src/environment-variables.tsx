"use client";

import {
  EnvironmentVariables,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariablesContent,
  EnvironmentVariable,
  EnvironmentVariableName,
  EnvironmentVariableValue,
  EnvironmentVariableCopyButton,
  EnvironmentVariableRequired,
} from "@repo/elements/environment-variables";

const variables = [
  { name: "DATABASE_URL", value: "postgresql://localhost:5432/mydb", required: true },
  { name: "API_KEY", value: "sk-1234567890abcdef", required: true },
  { name: "NODE_ENV", value: "production", required: false },
  { name: "PORT", value: "3000", required: false },
];

const Example = () => (
  <EnvironmentVariables defaultShowValues={false}>
    <EnvironmentVariablesHeader>
      <EnvironmentVariablesTitle />
      <EnvironmentVariablesToggle />
    </EnvironmentVariablesHeader>
    <EnvironmentVariablesContent>
      {variables.map((variable) => (
        <EnvironmentVariable
          key={variable.name}
          name={variable.name}
          value={variable.value}
        >
          <div className="flex items-center gap-2">
            <EnvironmentVariableName />
            {variable.required && <EnvironmentVariableRequired />}
          </div>
          <div className="flex items-center gap-2">
            <EnvironmentVariableValue />
            <EnvironmentVariableCopyButton
              copyFormat="export"
              onCopy={() => console.log("Copied!")}
            />
          </div>
        </EnvironmentVariable>
      ))}
    </EnvironmentVariablesContent>
  </EnvironmentVariables>
);

export default Example;
