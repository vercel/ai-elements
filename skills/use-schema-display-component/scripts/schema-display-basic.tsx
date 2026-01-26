"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const Example = () => (
  <SchemaDisplay description="List all users" method="GET" path="/api/users" />
);

export default Example;
