import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import Welcome from "./pages/Welcome";
import Todos from "./pages/protected/Todos";
import Task from "./pages/protected/Task";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/protected/Home";

const router = createBrowserRouter([
  { path: "/welcome", element: <Welcome /> },
  { path: "/login", element: <Login /> },
  { path: "/registration", element: <Registration /> },

  { path: "/", element: <Home /> },

  { path: "/time", element: <></> },

  { path: "/todo", element: <Todos /> },
  { path: "/todo/:todoId", element: <Task /> },

  { path: "/schedule", element: <></> },

  { path: "/curricula", element: <></> },

  { path: "/dashboard", element: <></> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
