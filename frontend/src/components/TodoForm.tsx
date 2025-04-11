import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Todo, CreateTodoInput } from "../types/todo";
import { todoApi } from "../services/api";

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  todo?: Todo;
  onSuccess?: () => void;
}

export const TodoForm = ({ open, onClose, todo, onSuccess }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [todo]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const todoData: CreateTodoInput = {
      title,
      description: description || undefined,
    };

    try {
      if (todo) {
        await todoApi.update(todo._id, todoData);
      } else {
        await todoApi.create(todoData);
      }
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Failed to save todo:", err);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disablePortal
      keepMounted={false}
      aria-labelledby="todo-dialog-title"
    >
      <DialogTitle id="todo-dialog-title">
        {todo ? "Edit Todo" : "Create Todo"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {todo ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
