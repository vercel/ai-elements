import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PackageInfo,
  PackageInfoChangeType,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoVersion,
} from "../src/package-info";

describe("PackageInfo", () => {
  it("renders package name", () => {
    render(<PackageInfo name="react" />);
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("renders with version change", () => {
    render(
      <PackageInfo currentVersion="18.0.0" name="react" newVersion="19.0.0" />
    );
    expect(screen.getByText("18.0.0")).toBeInTheDocument();
    expect(screen.getByText("19.0.0")).toBeInTheDocument();
  });

  it("renders with change type badge", () => {
    render(<PackageInfo changeType="major" name="react" />);
    expect(screen.getByText("major")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PackageInfo className="custom-class" name="react" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("PackageInfoChangeType", () => {
  it("renders major change type", () => {
    render(
      <PackageInfo changeType="major" name="test">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("major")).toBeInTheDocument();
  });

  it("renders minor change type", () => {
    render(
      <PackageInfo changeType="minor" name="test">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("minor")).toBeInTheDocument();
  });

  it("renders patch change type", () => {
    render(
      <PackageInfo changeType="patch" name="test">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("patch")).toBeInTheDocument();
  });

  it("renders added change type", () => {
    render(
      <PackageInfo changeType="added" name="test">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("added")).toBeInTheDocument();
  });

  it("renders removed change type", () => {
    render(
      <PackageInfo changeType="removed" name="test">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("removed")).toBeInTheDocument();
  });
});

describe("PackageInfoDescription", () => {
  it("renders description", () => {
    render(
      <PackageInfo name="react">
        <PackageInfoDescription>A JS library</PackageInfoDescription>
      </PackageInfo>
    );
    expect(screen.getByText("A JS library")).toBeInTheDocument();
  });
});

describe("PackageInfoDependencies", () => {
  it("renders dependencies list", () => {
    render(
      <PackageInfo name="react">
        <PackageInfoContent>
          <PackageInfoDependencies>
            <PackageInfoDependency name="react-dom" version="^19.0.0" />
            <PackageInfoDependency name="scheduler" version="^0.24.0" />
          </PackageInfoDependencies>
        </PackageInfoContent>
      </PackageInfo>
    );
    expect(screen.getByText("react-dom")).toBeInTheDocument();
    expect(screen.getByText("^19.0.0")).toBeInTheDocument();
    expect(screen.getByText("scheduler")).toBeInTheDocument();
  });
});

describe("Composability", () => {
  it("renders with custom children", () => {
    render(
      <PackageInfo
        changeType="major"
        currentVersion="18.0.0"
        name="react"
        newVersion="19.0.0"
      >
        <PackageInfoHeader>
          <PackageInfoName />
          <PackageInfoChangeType />
        </PackageInfoHeader>
        <PackageInfoVersion />
      </PackageInfo>
    );
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("major")).toBeInTheDocument();
    expect(screen.getByText("18.0.0")).toBeInTheDocument();
    expect(screen.getByText("19.0.0")).toBeInTheDocument();
  });
});
