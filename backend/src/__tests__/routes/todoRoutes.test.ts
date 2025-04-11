import request from "supertest";
import express from "express";
import todoRoutes from "../../routes/todoRoutes";
import { validateRequest } from "../../middleware/validateRequest";

// Mock the validateRequest middleware
jest.mock("../../middleware/validateRequest", () => {
  const mockMiddleware = jest.fn((req: any, res: any, next: any) => next());
  return {
    validateRequest: jest.fn().mockReturnValue(mockMiddleware),
    mockMiddleware,
  };
});

// Mock the todo controller
jest.mock("../../controllers/todoController", () => ({
  createTodo: jest.fn((req: any, res: any) =>
    res.status(201).json({ success: true, data: {} })
  ),
  getTodos: jest.fn((req: any, res: any) =>
    res.status(200).json({ success: true, data: [] })
  ),
  getTodo: jest.fn((req: any, res: any) =>
    res.status(200).json({ success: true, data: {} })
  ),
  updateTodo: jest.fn((req: any, res: any) =>
    res.status(200).json({ success: true, data: {} })
  ),
  deleteTodo: jest.fn((req: any, res: any) =>
    res
      .status(200)
      .json({ success: true, data: null, message: "Todo deleted successfully" })
  ),
}));

describe("Todo Routes", () => {
  let app: express.Application;
  const { mockMiddleware } = require("../../middleware/validateRequest");

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/todos", todoRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const todoData = {
        title: "Test Todo",
        description: "Test Description",
      };

      const response = await request(app).post("/api/todos").send(todoData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: expect.any(Object),
      });
      expect(mockMiddleware).toHaveBeenCalled();
    });
  });

  describe("GET /api/todos", () => {
    it("should get all todos", async () => {
      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.any(Array),
      });
    });
  });

  describe("GET /api/todos/:id", () => {
    it("should get a single todo", async () => {
      const response = await request(app).get("/api/todos/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.any(Object),
      });
      expect(mockMiddleware).toHaveBeenCalled();
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("should update a todo", async () => {
      const updateData = {
        title: "Updated Todo",
        description: "Updated Description",
        completed: true,
      };

      const response = await request(app)
        .put("/api/todos/123")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.any(Object),
      });
      expect(mockMiddleware).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete a todo", async () => {
      const response = await request(app).delete("/api/todos/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: null,
        message: "Todo deleted successfully",
      });
      expect(mockMiddleware).toHaveBeenCalled();
    });
  });

  describe("Validation", () => {
    it("should validate request body for POST /api/todos", async () => {
      const invalidData = {
        title: "", // Invalid empty title
      };

      const response = await request(app).post("/api/todos").send(invalidData);

      expect(mockMiddleware).toHaveBeenCalled();
    });

    it("should validate request params for GET /api/todos/:id", async () => {
      const response = await request(app).get("/api/todos/invalid-id");

      expect(mockMiddleware).toHaveBeenCalled();
    });
  });
});
