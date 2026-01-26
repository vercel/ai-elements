"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="POST"
    path="/api/posts"
    requestBody={[
      { name: "title", type: "string", required: true },
      { name: "content", type: "string", required: true },
    ]}
    responseBody={[
      { name: "id", type: "string", required: true },
      { name: "createdAt", type: "string", required: true },
    ]}
  />
);

export default Example;
