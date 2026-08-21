"use client";

import { SchemaDisplay } from "@repo/elements-base/schema-display";

const Example = () => (
  <SchemaDisplay description="List all users" method="GET" path="/api/users" />
);

export default Example;
