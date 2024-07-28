// Import the existing types from the 'node:test' module
import 'node:test';

declare module 'node:test' {
  // Extend the TestContext interface
  interface TestContext {
    assert: {
      snapshot(value: unknown): void;
    };
  }
}
