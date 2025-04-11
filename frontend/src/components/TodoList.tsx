import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Todo } from "../types/todo";
import { todoApi } from "../services/api";

interface TodoListProps {
  onEdit: (todo: Todo) => void;
  onRefresh?: () => void;
}

export const TodoList = ({ onEdit, onRefresh }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [onRefresh]);

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getAll();
      console.log("Received todos data:", data); // Debug log

      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: expected an array");
      }

      setTodos(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch todos";
      setError(errorMessage);
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      const updatedTodo = await todoApi.update(todo._id, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === todo._id ? updatedTodo : t)));
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todoApi.delete(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (todos.length === 0) {
    return <Typography>No todos found. Create one to get started!</Typography>;
  }

  return (
    <List>
      {todos.map((todo) => (
        <ListItem
          key={todo._id}
          sx={{
            bgcolor: "background.paper",
            mb: 1,
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Checkbox
            checked={todo.completed}
            onChange={() => handleToggle(todo)}
          />
          <ListItemText
            primary={todo.title}
            secondary={todo.description}
            sx={{
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "text.secondary" : "text.primary",
            }}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => onEdit(todo)}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(todo._id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
