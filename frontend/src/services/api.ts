import axios from "axios";
import { Todo, CreateTodoInput, UpdateTodoInput } from "../types/todo";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get("/todos");
    return response.data.data;
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  create: async (todo: CreateTodoInput): Promise<Todo> => {
    const response = await api.post("/todos", todo);
    return response.data;
  },

  update: async (id: string, todo: UpdateTodoInput): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};
