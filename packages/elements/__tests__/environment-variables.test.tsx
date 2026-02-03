import {
  EnvironmentVariable,
  EnvironmentVariableCopyButton,
  EnvironmentVariableName,
  EnvironmentVariableRequired,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
} from "#src/environment-variables";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("environmentVariables", () => {
  it("renders children", () => {
    render(
      <EnvironmentVariables>
        <div>Content</div>
      </EnvironmentVariables>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <EnvironmentVariables className="custom-class">
        <div>Content</div>
      </EnvironmentVariables>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("environmentVariablesHeader", () => {
  it("renders header with title and toggle", () => {
    render(
      <EnvironmentVariables>
        <EnvironmentVariablesHeader>
          <EnvironmentVariablesTitle />
          <EnvironmentVariablesToggle />
        </EnvironmentVariablesHeader>
      </EnvironmentVariables>
    );
    expect(screen.getByText("Environment Variables")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });
});

describe("environmentVariable", () => {
  it("renders variable name and masked value by default", () => {
    render(
      <EnvironmentVariables>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="API_KEY" value="secret123" />
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    );
    expect(screen.getByText("API_KEY")).toBeInTheDocument();
    expect(screen.queryByText("secret123")).not.toBeInTheDocument();
  });

  it("shows value when showValues is true", () => {
    render(
      <EnvironmentVariables defaultShowValues={true}>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="API_KEY" value="secret123" />
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    );
    expect(screen.getByText("secret123")).toBeInTheDocument();
  });

  it("toggles value visibility", async () => {
    const user = userEvent.setup();
    render(
      <EnvironmentVariables>
        <EnvironmentVariablesHeader>
          <EnvironmentVariablesToggle />
        </EnvironmentVariablesHeader>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="API_KEY" value="secret123" />
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    );

    expect(screen.queryByText("secret123")).not.toBeInTheDocument();

    const toggle = screen.getByRole("switch");
    await user.click(toggle);

    expect(screen.getByText("secret123")).toBeInTheDocument();
  });
});

describe("environmentVariableCopyButton", () => {
  it("copies value to clipboard", async () => {
    vi.clearAllMocks();
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <EnvironmentVariables>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="API_KEY" value="secret123">
            <EnvironmentVariableName />
            <EnvironmentVariableCopyButton />
          </EnvironmentVariable>
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith("secret123");
  });

  it("copies export format to clipboard", async () => {
    vi.clearAllMocks();
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <EnvironmentVariables>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="API_KEY" value="secret123">
            <EnvironmentVariableName />
            <EnvironmentVariableCopyButton copyFormat="export" />
          </EnvironmentVariable>
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith('export API_KEY="secret123"');
  });

  it("calls onCopy callback", async () => {
    vi.clearAllMocks();
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <EnvironmentVariables>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="API_KEY" value="secret">
            <EnvironmentVariableCopyButton onCopy={onCopy} />
          </EnvironmentVariable>
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onCopy).toHaveBeenCalledWith();
  });
});

describe("environmentVariableRequired", () => {
  it("renders required badge", () => {
    render(
      <EnvironmentVariables>
        <EnvironmentVariablesContent>
          <EnvironmentVariable name="API_KEY" value="secret">
            <EnvironmentVariableRequired />
          </EnvironmentVariable>
        </EnvironmentVariablesContent>
      </EnvironmentVariables>
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
