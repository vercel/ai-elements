"use client";

import { SchemaDisplay } from "@repo/elements/schema-display";

const Example = () => (
  <SchemaDisplay
    method="GET"
    path="/api/users"
    description="List all users"
  />
);

export default Example;
