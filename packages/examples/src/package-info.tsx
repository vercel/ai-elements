"use client";

import {
  PackageInfo,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoVersion,
  PackageInfoChangeType,
  PackageInfoDescription,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
} from "@repo/elements/package-info";

const Example = () => (
  <div className="flex flex-col gap-4">
    <PackageInfo
      name="react"
      currentVersion="18.2.0"
      newVersion="19.0.0"
      changeType="major"
    >
      <PackageInfoHeader>
        <PackageInfoName />
        <PackageInfoChangeType />
      </PackageInfoHeader>
      <PackageInfoVersion />
      <PackageInfoDescription>
        A JavaScript library for building user interfaces.
      </PackageInfoDescription>
      <PackageInfoContent>
        <PackageInfoDependencies>
          <PackageInfoDependency name="react-dom" version="^19.0.0" />
          <PackageInfoDependency name="scheduler" version="^0.24.0" />
        </PackageInfoDependencies>
      </PackageInfoContent>
    </PackageInfo>

    <PackageInfo name="lodash" changeType="added">
      <PackageInfoHeader>
        <PackageInfoName />
        <PackageInfoChangeType />
      </PackageInfoHeader>
      <PackageInfoVersion />
    </PackageInfo>

    <PackageInfo
      name="moment"
      currentVersion="2.29.4"
      changeType="removed"
    />
  </div>
);

export default Example;
