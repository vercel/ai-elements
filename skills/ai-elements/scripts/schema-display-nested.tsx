"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="POST"
    path="/api/posts"
    requestBody={[
      {
        name: "author",
        type: "object",
        properties: [
          { name: "id", type: "string" },
          { name: "name", type: "string" },
        ],
      },
      { name: "title", type: "string", required: true },
    ]}
  />
);

export default Example;
