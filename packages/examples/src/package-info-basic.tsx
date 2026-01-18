"use client";

import { PackageInfo } from "@repo/elements/package-info";

const Example = () => (
  <PackageInfo
    name="react"
    currentVersion="18.2.0"
    newVersion="19.0.0"
    changeType="major"
  />
);

export default Example;
