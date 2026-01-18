"use client";

import {
  PackageInfo,
  PackageInfoChangeType,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoHeader,
  PackageInfoName,
} from "@repo/elements/package-info";

const Example = () => (
  <PackageInfo name="react" changeType="added">
    <PackageInfoHeader>
      <PackageInfoName />
      <PackageInfoChangeType />
    </PackageInfoHeader>
    <PackageInfoContent>
      <PackageInfoDependencies>
        <PackageInfoDependency name="react-dom" version="^19.0.0" />
        <PackageInfoDependency name="scheduler" version="^0.24.0" />
      </PackageInfoDependencies>
    </PackageInfoContent>
  </PackageInfo>
);

export default Example;
