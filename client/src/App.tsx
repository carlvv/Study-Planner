import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import Task from "./pages/Task";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/todo", element: <Todos /> },
  { path: "/todo/:todoId", element: <Task /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
