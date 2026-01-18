"use client";

import {
  EnvironmentVariable,
  EnvironmentVariableName,
  EnvironmentVariableRequired,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariableValue,
} from "@repo/elements/environment-variables";

const Example = () => (
  <EnvironmentVariables>
    <EnvironmentVariablesHeader>
      <EnvironmentVariablesTitle />
      <EnvironmentVariablesToggle />
    </EnvironmentVariablesHeader>
    <EnvironmentVariablesContent>
      <EnvironmentVariable name="DATABASE_URL" value="postgres://localhost:5432/db">
        <div className="flex items-center gap-2">
          <EnvironmentVariableName />
          <EnvironmentVariableRequired />
        </div>
        <EnvironmentVariableValue />
      </EnvironmentVariable>
      <EnvironmentVariable name="API_KEY" value="sk-123456">
        <div className="flex items-center gap-2">
          <EnvironmentVariableName />
          <EnvironmentVariableRequired />
        </div>
        <EnvironmentVariableValue />
      </EnvironmentVariable>
    </EnvironmentVariablesContent>
  </EnvironmentVariables>
);

export default Example;
