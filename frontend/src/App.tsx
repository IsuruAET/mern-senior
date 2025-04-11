import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TodoList } from "./components/TodoList";
import { TodoForm } from "./components/TodoForm";
import { Todo } from "./types/todo";

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedTodo(undefined);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Todos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Todo
          </Button>
        </Box>

        <TodoList
          key={refreshKey}
          onEdit={handleEdit}
          onRefresh={handleRefresh}
        />

        <TodoForm
          open={isFormOpen}
          onClose={handleClose}
          todo={selectedTodo}
          onSuccess={handleRefresh}
        />
      </Container>
    </>
  );
}

export default App;
