import { z } from "zod";

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    completed: z.boolean().optional().default(false),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Todo ID is required"),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  }),
});

export const getTodoSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Todo ID is required"),
  }),
});

export const deleteTodoSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Todo ID is required"),
  }),
});
