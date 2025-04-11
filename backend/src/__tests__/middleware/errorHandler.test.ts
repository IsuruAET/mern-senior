import { Request, Response, NextFunction } from "express";
import { errorHandler, AppError } from "../../middleware/errorHandler";
import { ZodError } from "zod";

describe("Error Handler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    nextFunction = jest.fn();
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle AppError with custom status code", () => {
    const error = new AppError("Custom error", 400);
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: 400,
      message: "Custom error",
    });
  });

  it("should handle AppError with additional errors", () => {
    const additionalErrors = { field: "Invalid value" };
    const error = new AppError("Validation error", 400, additionalErrors);
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: 400,
      message: "Validation error",
      errors: additionalErrors,
    });
  });

  it("should handle ZodError", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        path: ["field"],
        message: "Invalid type",
        expected: "string",
        received: "number",
      },
    ]);
    errorHandler(
      zodError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: 400,
      message: "Validation failed",
      errors: zodError.errors,
    });
  });

  it("should handle generic Error", () => {
    const error = new Error("Generic error");
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: "Generic error",
    });
  });

  it("should include stack trace in development environment", () => {
    process.env.NODE_ENV = "development";
    const error = new Error("Test error");
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: "Test error",
      stack: expect.any(String),
    });
  });

  it("should not include stack trace in production environment", () => {
    process.env.NODE_ENV = "production";
    const error = new Error("Test error");
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: "Test error",
    });
  });

  it("should handle error without message", () => {
    const error = new Error();
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
  });
});
