import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";
import Todo from "../models/Todo";

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ title, description });
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError("Failed to create todo", 400, error.message));
    } else {
      next(error);
    }
  }
};

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      next(error);
    } else {
      next(new AppError("Failed to fetch todos", 500));
    }
  }
};

export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to fetch todo", 500));
    }
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true, runValidators: true }
    );
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to update todo", 500));
    }
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }
    res.status(200).json({
      success: true,
      data: null,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to delete todo", 500));
    }
  }
};
