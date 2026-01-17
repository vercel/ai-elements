import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
} from "../src/package-info";

describe("PackageInfo", () => {
  it("renders package name", () => {
    render(<PackageInfo name="react" />);
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("renders with version change", () => {
    render(
      <PackageInfo name="react" currentVersion="18.0.0" newVersion="19.0.0" />
    );
    expect(screen.getByText("18.0.0")).toBeInTheDocument();
    expect(screen.getByText("19.0.0")).toBeInTheDocument();
  });

  it("renders with change type badge", () => {
    render(<PackageInfo name="react" changeType="major" />);
    expect(screen.getByText("major")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PackageInfo name="react" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("PackageInfoChangeType", () => {
  it("renders major change type", () => {
    render(
      <PackageInfo name="test" changeType="major">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("major")).toBeInTheDocument();
  });

  it("renders minor change type", () => {
    render(
      <PackageInfo name="test" changeType="minor">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("minor")).toBeInTheDocument();
  });

  it("renders patch change type", () => {
    render(
      <PackageInfo name="test" changeType="patch">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("patch")).toBeInTheDocument();
  });

  it("renders added change type", () => {
    render(
      <PackageInfo name="test" changeType="added">
        <PackageInfoChangeType />
      </PackageInfo>
    );
    expect(screen.getByText("added")).toBeInTheDocument();
  });

  it("renders removed change type", () => {
    render(
      <PackageInfo name="test" changeType="removed">
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
      <PackageInfo name="react" currentVersion="18.0.0" newVersion="19.0.0" changeType="major">
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
