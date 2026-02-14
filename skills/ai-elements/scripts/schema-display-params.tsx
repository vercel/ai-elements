"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="GET"
    parameters={[
      { location: "path", name: "userId", required: true, type: "string" },
      { location: "query", name: "include", type: "string" },
    ]}
    path="/api/users/{userId}"
  />
);

export default Example;
