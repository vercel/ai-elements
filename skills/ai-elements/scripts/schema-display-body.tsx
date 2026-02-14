"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="POST"
    path="/api/posts"
    requestBody={[
      { name: "title", required: true, type: "string" },
      { name: "content", required: true, type: "string" },
    ]}
    responseBody={[
      { name: "id", required: true, type: "string" },
      { name: "createdAt", required: true, type: "string" },
    ]}
  />
);

export default Example;
