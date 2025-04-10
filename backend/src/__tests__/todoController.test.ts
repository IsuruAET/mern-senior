import { Request, Response, NextFunction } from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import Todo from "../models/Todo";
import { AppError } from "../middleware/errorHandler";

// Mock the Todo model
jest.mock("../models/Todo");

describe("Todo Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("createTodo", () => {
    it("should create a new todo successfully", async () => {
      const mockTodo = {
        _id: "1",
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Todo.create as jest.Mock).mockResolvedValue(mockTodo);
      mockRequest.body = {
        title: "Test Todo",
        description: "Test Description",
      };

      await createTodo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(Todo.create).toHaveBeenCalledWith({
        title: "Test Todo",
        description: "Test Description",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should handle creation error", async () => {
      const error = new Error("Database error");
      (Todo.create as jest.Mock).mockRejectedValue(error);
      mockRequest.body = {
        title: "Test Todo",
        description: "Test Description",
      };

      await createTodo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("getTodos", () => {
    it("should fetch all todos successfully", async () => {
      const mockTodos = [
        {
          _id: "1",
          title: "Test Todo 1",
          description: "Test Description 1",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          title: "Test Todo 2",
          description: "Test Description 2",
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (Todo.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTodos),
      });

      await getTodos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        count: mockTodos.length,
        data: mockTodos,
      });
    });

    it("should handle fetch error", async () => {
      (Todo.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await getTodos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("getTodo", () => {
    it("should fetch a single todo successfully", async () => {
      const mockTodo = {
        _id: "1",
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);
      mockRequest.params = { id: "1" };

      await getTodo(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Todo.findById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should handle todo not found", async () => {
      (Todo.findById as jest.Mock).mockResolvedValue(null);
      mockRequest.params = { id: "1" };

      await getTodo(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("updateTodo", () => {
    it("should update a todo successfully", async () => {
      const mockTodo = {
        _id: "1",
        title: "Updated Todo",
        description: "Updated Description",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTodo);
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        title: "Updated Todo",
        description: "Updated Description",
        completed: true,
      };

      await updateTodo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        {
          title: "Updated Todo",
          description: "Updated Description",
          completed: true,
        },
        { new: true, runValidators: true }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });
    });

    it("should handle todo not found during update", async () => {
      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        title: "Updated Todo",
        description: "Updated Description",
        completed: true,
      };

      await updateTodo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo successfully", async () => {
      const mockTodo = {
        _id: "1",
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Todo.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTodo);
      mockRequest.params = { id: "1" };

      await deleteTodo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(Todo.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: "Todo deleted successfully",
      });
    });

    it("should handle todo not found during deletion", async () => {
      (Todo.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      mockRequest.params = { id: "1" };

      await deleteTodo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
