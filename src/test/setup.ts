import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Clean up DOM after each test to avoid cross-test contamination
afterEach(() => {
  cleanup();
});

// Suppress console errors/warnings that originate from third-party libraries
// during test rendering (e.g., PWA workbox warnings in jsdom).
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const message = args[0]?.toString() || "";
  if (
    message.includes("not wrapped in act") ||
    message.includes("workbox") ||
    message.includes("service worker")
  ) {
    return;
  }
  originalError(...args);
};
