"use client";

import { SchemaDisplay } from "@repo/elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="GET"
    path="/api/users/{userId}"
    parameters={[
      { name: "userId", type: "string", required: true, location: "path" },
      { name: "include", type: "string", location: "query" },
    ]}
  />
);

export default Example;
