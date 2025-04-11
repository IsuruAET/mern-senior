import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = "test";

// Mock console methods
global.console = {
  ...console,
  // Uncomment to see console output during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
  // debug: jest.fn(),
};
