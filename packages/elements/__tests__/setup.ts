import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

// Mock CSS imports
vi.mock("*.css", () => ({}));
vi.mock("katex/dist/katex.min.css", () => ({}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(function (this: ResizeObserver) {
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
  return this;
}) as unknown as typeof ResizeObserver;

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(function (this: IntersectionObserver) {
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
  this.root = null;
  this.rootMargin = "";
  this.thresholds = [];
  this.takeRecords = vi.fn(() => []);
  return this;
}) as unknown as typeof IntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Patch createElement to handle SVG elements properly in jsdom
const SVG_TAGS = new Set([
  "svg",
  "path",
  "circle",
  "g",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
  "text",
  "tspan",
  "defs",
  "clipPath",
]);

const originalCreateElement = document.createElement.bind(document);
// @ts-expect-error - Overriding createElement signature for test environment
document.createElement = (
  tagName: string,
  options?: ElementCreationOptions
) => {
  if (SVG_TAGS.has(tagName.toLowerCase())) {
    return document.createElementNS("http://www.w3.org/2000/svg", tagName);
  }
  return originalCreateElement(tagName, options);
};

// Fail the test if there are any console logs during test execution
failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnDebug: true,
  shouldFailOnInfo: true,
  shouldFailOnWarn: true,
  shouldFailOnError: true,
  shouldFailOnLog: true,
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
