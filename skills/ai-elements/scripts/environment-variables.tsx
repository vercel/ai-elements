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
    required: true,
    value: "postgresql://localhost:5432/mydb",
  },
  { name: "API_KEY", required: true, value: "sk-1234567890abcdef" },
  { name: "NODE_ENV", required: false, value: "production" },
  { name: "PORT", required: false, value: "3000" },
];

const handleCopy = () => {
  console.log("Copied!");
};

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
              onCopy={handleCopy}
            />
          </EnvironmentVariableGroup>
        </EnvironmentVariable>
      ))}
    </EnvironmentVariablesContent>
  </EnvironmentVariables>
);

export default Example;
