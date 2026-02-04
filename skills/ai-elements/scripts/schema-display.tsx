"use client";

import {
  SchemaDisplay,
  SchemaDisplayContent,
  SchemaDisplayDescription,
  SchemaDisplayHeader,
  SchemaDisplayMethod,
  SchemaDisplayParameters,
  SchemaDisplayPath,
  SchemaDisplayRequest,
  SchemaDisplayResponse,
} from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay
    description="Create a new post for a specific user. Requires authentication."
    method="POST"
    parameters={[
      {
        description: "The unique identifier of the user",
        location: "path",
        name: "userId",
        required: true,
        type: "string",
      },
      {
        description: "Save as draft instead of publishing",
        location: "query",
        name: "draft",
        required: false,
        type: "boolean",
      },
    ]}
    path="/api/users/{userId}/posts"
    requestBody={[
      {
        description: "The post title",
        name: "title",
        required: true,
        type: "string",
      },
      {
        description: "The post content in markdown format",
        name: "content",
        required: true,
        type: "string",
      },
      {
        description: "Tags for categorization",
        items: { name: "tag", type: "string" },
        name: "tags",
        type: "array",
      },
      {
        description: "Additional metadata",
        name: "metadata",
        properties: [
          {
            description: "SEO optimized title",
            name: "seoTitle",
            type: "string",
          },
          {
            description: "Meta description",
            name: "seoDescription",
            type: "string",
          },
        ],
        type: "object",
      },
    ]}
    responseBody={[
      { description: "Post ID", name: "id", required: true, type: "string" },
      { name: "title", required: true, type: "string" },
      { name: "content", required: true, type: "string" },
      {
        description: "ISO 8601 timestamp",
        name: "createdAt",
        required: true,
        type: "string",
      },
      {
        name: "author",
        properties: [
          { name: "id", required: true, type: "string" },
          { name: "name", required: true, type: "string" },
          { name: "avatar", type: "string" },
        ],
        required: true,
        type: "object",
      },
    ]}
  >
    <SchemaDisplayHeader>
      <div className="flex items-center gap-3">
        <SchemaDisplayMethod />
        <SchemaDisplayPath />
      </div>
    </SchemaDisplayHeader>
    <SchemaDisplayDescription />
    <SchemaDisplayContent>
      <SchemaDisplayParameters />
      <SchemaDisplayRequest />
      <SchemaDisplayResponse />
    </SchemaDisplayContent>
  </SchemaDisplay>
);

export default Example;
