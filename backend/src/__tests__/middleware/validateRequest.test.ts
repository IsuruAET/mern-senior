import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { z } from "zod";

describe("validateRequest Middleware", () => {
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
  });

  it("should call next() when validation passes", async () => {
    const schema = z.object({
      body: z.object({
        title: z.string(),
      }),
    });

    mockRequest.body = { title: "Test Todo" };
    const middleware = validateRequest(schema);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it("should return 400 with validation errors when validation fails", async () => {
    const schema = z.object({
      body: z.object({
        title: z.string().min(1),
      }),
    });

    mockRequest.body = { title: "" };
    const middleware = validateRequest(schema);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      status: "error",
      message: "Validation failed",
      errors: expect.any(Array),
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should handle query parameter validation", async () => {
    const schema = z.object({
      query: z.object({
        page: z.string().optional(),
      }),
    });

    mockRequest.query = { page: "1" };
    const middleware = validateRequest(schema);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it("should handle route parameter validation", async () => {
    const schema = z.object({
      params: z.object({
        id: z.string().min(1),
      }),
    });

    mockRequest.params = { id: "123" };
    const middleware = validateRequest(schema);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it("should call next with error for non-Zod errors", async () => {
    const schema = z.object({
      body: z.object({
        title: z.string(),
      }),
    });

    // Mock a non-Zod error
    const error = new Error("Some other error");
    jest.spyOn(schema, "parseAsync").mockRejectedValueOnce(error);

    mockRequest.body = { title: "Test Todo" };
    const middleware = validateRequest(schema);

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(error);
    expect(mockStatus).not.toHaveBeenCalled();
  });
});
