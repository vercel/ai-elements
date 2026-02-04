import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

// Mock clipboard API for browser environment
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: vi.fn(() => Promise.resolve()),
  },
  writable: true,
});

// Fail the test if there are any console logs during test execution
failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnDebug: true,
  shouldFailOnError: true,
  shouldFailOnInfo: true,
  shouldFailOnLog: true,
  shouldFailOnWarn: true,
  silenceMessage: (message) => {
    // Silence React 18 deprecation warnings from Radix UI dependencies
    if (message.includes("ReactDOM.render is deprecated since React 18")) {
      return true;
    }
    // Silence Sonner deprecation warnings
    if (message.includes("toastOptions.className")) {
      return true;
    }
    // Silence React act() warnings from Radix UI tooltip timing
    if (message.includes("was not wrapped in act")) {
      return true;
    }
    return false;
  },
});

// Cleanup after each test - this is a global setup file
// oxlint-disable-next-line eslint-plugin-jest(no-hooks)
afterEach(() => {
  cleanup();
});
