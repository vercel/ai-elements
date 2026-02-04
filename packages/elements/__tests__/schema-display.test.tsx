import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  SchemaDisplay,
  SchemaDisplayContent,
  SchemaDisplayDescription,
  SchemaDisplayExample,
  SchemaDisplayHeader,
  SchemaDisplayMethod,
  SchemaDisplayParameter,
  SchemaDisplayParameters,
  SchemaDisplayPath,
  SchemaDisplayProperty,
  SchemaDisplayRequest,
  SchemaDisplayResponse,
} from "../src/schema-display";

describe("schemaDisplay", () => {
  it("renders method and path", () => {
    render(<SchemaDisplay method="GET" path="/api/users" />);
    expect(screen.getByText("GET")).toBeInTheDocument();
    expect(screen.getByText("/api/users")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <SchemaDisplay
        description="List all users"
        method="GET"
        path="/api/users"
      />
    );
    expect(screen.getByText("List all users")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SchemaDisplay className="custom-class" method="GET" path="/api/users" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("schemaDisplayMethod", () => {
  it("renders GET with green styling", () => {
    render(
      <SchemaDisplay method="GET" path="/test">
        <SchemaDisplayMethod />
      </SchemaDisplay>
    );
    const badge = screen.getByText("GET");
    expect(badge).toHaveClass("bg-green-100");
  });

  it("renders POST with blue styling", () => {
    render(
      <SchemaDisplay method="POST" path="/test">
        <SchemaDisplayMethod />
      </SchemaDisplay>
    );
    const badge = screen.getByText("POST");
    expect(badge).toHaveClass("bg-blue-100");
  });

  it("renders DELETE with red styling", () => {
    render(
      <SchemaDisplay method="DELETE" path="/test">
        <SchemaDisplayMethod />
      </SchemaDisplay>
    );
    const badge = screen.getByText("DELETE");
    expect(badge).toHaveClass("bg-red-100");
  });
});

describe("schemaDisplayPath", () => {
  it("renders path with parameters highlighted", () => {
    const { container } = render(
      <SchemaDisplay method="GET" path="/api/users/{userId}/posts">
        <SchemaDisplayPath />
      </SchemaDisplay>
    );
    expect(container.innerHTML).toContain("text-blue-600");
  });
});

describe("schemaDisplayParameters", () => {
  it("renders parameters", () => {
    render(
      <SchemaDisplay
        method="GET"
        parameters={[
          { description: "Page number", name: "page", type: "number" },
          { name: "limit", required: true, type: "number" },
        ]}
        path="/api/users"
      >
        <SchemaDisplayContent>
          <SchemaDisplayParameters />
        </SchemaDisplayContent>
      </SchemaDisplay>
    );

    // Parameters section should be visible by default
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("page")).toBeInTheDocument();
    expect(screen.getByText("limit")).toBeInTheDocument();
    expect(screen.getByText("Page number")).toBeInTheDocument();
    expect(screen.getByText("required")).toBeInTheDocument();
  });

  it("shows parameter count", () => {
    render(
      <SchemaDisplay
        method="GET"
        parameters={[
          { name: "a", type: "string" },
          { name: "b", type: "string" },
        ]}
        path="/test"
      >
        <SchemaDisplayParameters />
      </SchemaDisplay>
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("schemaDisplayParameter", () => {
  it("renders parameter with location", () => {
    render(
      <SchemaDisplay method="GET" path="/test">
        <SchemaDisplayParameter
          location="path"
          name="userId"
          required
          type="string"
        />
      </SchemaDisplay>
    );
    expect(screen.getByText("userId")).toBeInTheDocument();
    expect(screen.getByText("string")).toBeInTheDocument();
    expect(screen.getByText("path")).toBeInTheDocument();
    expect(screen.getByText("required")).toBeInTheDocument();
  });
});

describe("schemaDisplayProperty", () => {
  it("renders simple property", () => {
    render(
      <SchemaDisplay method="GET" path="/test">
        <SchemaDisplayProperty
          description="The title"
          name="title"
          required
          type="string"
        />
      </SchemaDisplay>
    );
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("string")).toBeInTheDocument();
    expect(screen.getByText("required")).toBeInTheDocument();
    expect(screen.getByText("The title")).toBeInTheDocument();
  });

  it("renders nested properties", () => {
    render(
      <SchemaDisplay method="GET" path="/test">
        <SchemaDisplayProperty
          name="user"
          properties={[
            { name: "id", type: "string" },
            { name: "name", type: "string" },
          ]}
          type="object"
        />
      </SchemaDisplay>
    );

    expect(screen.getByText("user")).toBeInTheDocument();
    // Nested properties should be visible by default (depth < 2)
    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
  });
});

describe("schemaDisplayExample", () => {
  it("renders example code", () => {
    render(
      <SchemaDisplay method="GET" path="/test">
        <SchemaDisplayExample>{'{ "id": "123" }'}</SchemaDisplayExample>
      </SchemaDisplay>
    );
    expect(screen.getByText('{ "id": "123" }')).toBeInTheDocument();
  });
});

describe("composability", () => {
  it("renders full schema display", () => {
    render(
      <SchemaDisplay
        description="Create a user"
        method="POST"
        parameters={[{ name: "userId", required: true, type: "string" }]}
        path="/api/users/{userId}"
        requestBody={[{ name: "name", required: true, type: "string" }]}
        responseBody={[{ name: "id", required: true, type: "string" }]}
      >
        <SchemaDisplayHeader>
          <SchemaDisplayMethod />
          <SchemaDisplayPath />
        </SchemaDisplayHeader>
        <SchemaDisplayDescription />
        <SchemaDisplayContent>
          <SchemaDisplayParameters />
          <SchemaDisplayRequest />
          <SchemaDisplayResponse />
        </SchemaDisplayContent>
      </SchemaDisplay>
    );

    expect(screen.getByText("POST")).toBeInTheDocument();
    expect(screen.getByText("Create a user")).toBeInTheDocument();
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Request Body")).toBeInTheDocument();
    expect(screen.getByText("Response")).toBeInTheDocument();
  });
});
