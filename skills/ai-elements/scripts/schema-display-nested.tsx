"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="POST"
    path="/api/posts"
    requestBody={[
      {
        name: "author",
        properties: [
          { name: "id", type: "string" },
          { name: "name", type: "string" },
        ],
        type: "object",
      },
      { name: "title", required: true, type: "string" },
    ]}
  />
);

export default Example;
