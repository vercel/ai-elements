"use client";

import { Commit } from "@repo/elements/commit";

const Example = () => (
  <Commit
    hash="a1b2c3d4e5f6"
    message="feat: Add new feature"
    author="John Doe"
    timestamp={new Date()}
    files={[{ path: "src/index.ts", status: "added", additions: 50 }]}
  />
);

export default Example;
