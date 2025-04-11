import mongoose from "mongoose";
import Todo from "../../models/Todo";

describe("Todo Model", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  it("should create a new todo successfully", async () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Description",
    };

    const todo = await Todo.create(todoData);

    expect(todo).toBeDefined();
    expect(todo.title).toBe(todoData.title);
    expect(todo.description).toBe(todoData.description);
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
  });

  it("should require title field", async () => {
    const todoData = {
      description: "Test Description",
    };

    await expect(Todo.create(todoData)).rejects.toThrow();
  });

  it("should require description field", async () => {
    const todoData = {
      title: "Test Todo",
    };

    await expect(Todo.create(todoData)).rejects.toThrow();
  });

  it("should enforce title length limit", async () => {
    const longTitle = "a".repeat(101);
    const todoData = {
      title: longTitle,
      description: "Test Description",
    };

    await expect(Todo.create(todoData)).rejects.toThrow();
  });

  it("should trim title and description", async () => {
    const todoData = {
      title: "  Test Todo  ",
      description: "  Test Description  ",
    };

    const todo = await Todo.create(todoData);

    expect(todo.title).toBe("Test Todo");
    expect(todo.description).toBe("Test Description");
  });

  it("should set completed to false by default", async () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Description",
    };

    const todo = await Todo.create(todoData);
    expect(todo.completed).toBe(false);
  });

  it("should allow setting completed to true", async () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Description",
      completed: true,
    };

    const todo = await Todo.create(todoData);
    expect(todo.completed).toBe(true);
  });
});
