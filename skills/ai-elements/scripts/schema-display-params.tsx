"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="GET"
    parameters={[
      { name: "userId", type: "string", required: true, location: "path" },
      { name: "include", type: "string", location: "query" },
    ]}
    path="/api/users/{userId}"
  />
);

export default Example;
