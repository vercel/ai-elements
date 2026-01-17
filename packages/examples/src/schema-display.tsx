"use client";

import {
  SchemaDisplay,
  SchemaDisplayHeader,
  SchemaDisplayMethod,
  SchemaDisplayPath,
  SchemaDisplayDescription,
  SchemaDisplayContent,
  SchemaDisplayParameters,
  SchemaDisplayRequest,
  SchemaDisplayResponse,
} from "@repo/elements/schema-display";

const Example = () => (
  <div className="flex flex-col gap-4">
    <SchemaDisplay
      method="POST"
      path="/api/users/{userId}/posts"
      description="Create a new post for a specific user. Requires authentication."
      parameters={[
        {
          name: "userId",
          type: "string",
          required: true,
          description: "The unique identifier of the user",
          location: "path",
        },
        {
          name: "draft",
          type: "boolean",
          required: false,
          description: "Save as draft instead of publishing",
          location: "query",
        },
      ]}
      requestBody={[
        {
          name: "title",
          type: "string",
          required: true,
          description: "The post title",
        },
        {
          name: "content",
          type: "string",
          required: true,
          description: "The post content in markdown format",
        },
        {
          name: "tags",
          type: "array",
          description: "Tags for categorization",
          items: { name: "tag", type: "string" },
        },
        {
          name: "metadata",
          type: "object",
          description: "Additional metadata",
          properties: [
            { name: "seoTitle", type: "string", description: "SEO optimized title" },
            { name: "seoDescription", type: "string", description: "Meta description" },
          ],
        },
      ]}
      responseBody={[
        { name: "id", type: "string", required: true, description: "Post ID" },
        { name: "title", type: "string", required: true },
        { name: "content", type: "string", required: true },
        { name: "createdAt", type: "string", required: true, description: "ISO 8601 timestamp" },
        {
          name: "author",
          type: "object",
          required: true,
          properties: [
            { name: "id", type: "string", required: true },
            { name: "name", type: "string", required: true },
            { name: "avatar", type: "string" },
          ],
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

    <SchemaDisplay
      method="GET"
      path="/api/users"
      description="List all users with pagination support."
      parameters={[
        { name: "page", type: "number", description: "Page number", location: "query" },
        { name: "limit", type: "number", description: "Items per page", location: "query" },
      ]}
    />

    <SchemaDisplay
      method="DELETE"
      path="/api/posts/{postId}"
      description="Delete a post permanently. This action cannot be undone."
      parameters={[
        { name: "postId", type: "string", required: true, location: "path" },
      ]}
    />
  </div>
);

export default Example;
