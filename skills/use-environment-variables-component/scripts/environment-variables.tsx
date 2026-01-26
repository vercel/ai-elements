"use client";

import {
  EnvironmentVariable,
  EnvironmentVariableCopyButton,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableRequired,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariableValue,
} from "@/components/ai-elements/environment-variables";

const variables = [
  {
    name: "DATABASE_URL",
    value: "postgresql://localhost:5432/mydb",
    required: true,
  },
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
          <EnvironmentVariableGroup>
            <EnvironmentVariableName />
            {variable.required && <EnvironmentVariableRequired />}
          </EnvironmentVariableGroup>
          <EnvironmentVariableGroup>
            <EnvironmentVariableValue />
            <EnvironmentVariableCopyButton
              copyFormat="export"
              onCopy={() => console.log("Copied!")}
            />
          </EnvironmentVariableGroup>
        </EnvironmentVariable>
      ))}
    </EnvironmentVariablesContent>
  </EnvironmentVariables>
);

export default Example;
