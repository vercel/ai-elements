"use client";

import {
  EnvironmentVariable,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
} from "@repo/elements/environment-variables";

const Example = () => (
  <EnvironmentVariables>
    <EnvironmentVariablesHeader>
      <EnvironmentVariablesTitle />
      <EnvironmentVariablesToggle />
    </EnvironmentVariablesHeader>
    <EnvironmentVariablesContent>
      <EnvironmentVariable name="API_KEY" value="sk-123456" />
    </EnvironmentVariablesContent>
  </EnvironmentVariables>
);

export default Example;
