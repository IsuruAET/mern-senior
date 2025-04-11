import { Request, Response, NextFunction } from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../../controllers/todoController";
import { AppError } from "../../middleware/errorHandler";
import Todo from "../../models/Todo";

// Mock the Todo model
jest.mock("../../models/Todo");

describe("Todo Controller", () => {
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
    jest.clearAllMocks();
  });

  describe("createTodo", () => {
    it("should create a new todo", async () => {
      const todoData = {
        title: "Test Todo",
        description: "Test Description",
      };
      mockRequest.body = todoData;

      const mockTodo = {
        _id: "123",
        ...todoData,
        toJSON: jest.fn().mockReturnValue({ _id: "123", ...todoData }),
      };

      (Todo.create as jest.Mock).mockResolvedValueOnce(mockTodo);

      await createTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(Todo.create).toHaveBeenCalledWith(todoData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should handle creation error", async () => {
      const error = new Error("Database error");
      mockRequest.body = { title: "Test Todo" };
      (Todo.create as jest.Mock).mockRejectedValueOnce(error);

      await createTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create todo",
          statusCode: 400,
        })
      );
    });

    it("should handle non-Error instance in createTodo", async () => {
      const nonError = "not an error";
      mockRequest.body = { title: "Test Todo" };
      (Todo.create as jest.Mock).mockRejectedValueOnce(nonError);

      await createTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(nonError);
    });
  });

  describe("getTodos", () => {
    it("should get all todos", async () => {
      const mockTodos = [
        { _id: "1", title: "Todo 1" },
        { _id: "2", title: "Todo 2" },
      ];
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(mockTodos),
      });

      await getTodos(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: mockTodos.length,
        data: mockTodos,
      });
    });

    it("should handle fetch error with 500 status code", async () => {
      const error = new Error("Database error");
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(error),
      });

      await getTodos(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to fetch todos",
          statusCode: 500,
        })
      );
    });

    it("should pass non-AppError directly to next", async () => {
      const error = new Error("Custom error");
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(error),
      });

      await getTodos(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to fetch todos",
          statusCode: 500,
        })
      );
    });

    it("should handle non-Error instance in getTodos", async () => {
      const nonError = "not an error";
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(nonError),
      });

      await getTodos(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(nonError);
    });
  });

  describe("getTodo", () => {
    it("should get a single todo", async () => {
      const mockTodo = { _id: "123", title: "Test Todo" };
      mockRequest.params = { id: "123" };
      (Todo.findById as jest.Mock).mockResolvedValueOnce(mockTodo);

      await getTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(Todo.findById).toHaveBeenCalledWith("123");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should handle todo not found", async () => {
      mockRequest.params = { id: "123" };
      (Todo.findById as jest.Mock).mockResolvedValueOnce(null);

      await getTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Todo not found",
          statusCode: 404,
        })
      );
    });

    it("should handle fetch error", async () => {
      const error = new Error("Database error");
      mockRequest.params = { id: "123" };
      (Todo.findById as jest.Mock).mockRejectedValueOnce(error);

      await getTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to fetch todo",
          statusCode: 500,
        })
      );
    });
  });

  describe("updateTodo", () => {
    it("should update a todo", async () => {
      const updateData = {
        title: "Updated Todo",
        description: "Updated Description",
        completed: true,
      };
      mockRequest.params = { id: "123" };
      mockRequest.body = updateData;

      const mockUpdatedTodo = {
        _id: "123",
        ...updateData,
      };

      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(
        mockUpdatedTodo
      );

      await updateTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith("123", updateData, {
        new: true,
        runValidators: true,
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedTodo,
      });
    });

    it("should handle todo not found", async () => {
      mockRequest.params = { id: "123" };
      mockRequest.body = { title: "Updated Todo" };
      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

      await updateTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Todo not found",
          statusCode: 404,
        })
      );
    });

    it("should handle update error", async () => {
      const error = new Error("Database error");
      mockRequest.params = { id: "123" };
      mockRequest.body = { title: "Updated Todo" };
      (Todo.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(error);

      await updateTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to update todo",
          statusCode: 500,
        })
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo", async () => {
      const mockDeletedTodo = { _id: "123", title: "Test Todo" };
      mockRequest.params = { id: "123" };
      (Todo.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(
        mockDeletedTodo
      );

      await deleteTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(Todo.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: "Todo deleted successfully",
      });
    });

    it("should handle todo not found", async () => {
      mockRequest.params = { id: "123" };
      (Todo.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

      await deleteTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Todo not found",
          statusCode: 404,
        })
      );
    });

    it("should handle delete error", async () => {
      const error = new Error("Database error");
      mockRequest.params = { id: "123" };
      (Todo.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(error);

      await deleteTodo(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete todo",
          statusCode: 500,
        })
      );
    });
  });
});
