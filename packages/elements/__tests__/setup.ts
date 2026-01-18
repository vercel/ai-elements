import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

// Mock clipboard API for browser environment
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
  },
  writable: true,
  configurable: true,
});

// Fail the test if there are any console logs during test execution
failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnDebug: true,
  shouldFailOnInfo: true,
  shouldFailOnWarn: true,
  shouldFailOnError: true,
  shouldFailOnLog: true,
  silenceMessage: (message) => {
    // Silence React 18 deprecation warnings from Radix UI dependencies
    if (message.includes("ReactDOM.render is deprecated since React 18")) {
      return true;
    }
    return false;
  },
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
