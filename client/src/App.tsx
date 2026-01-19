import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Registration from "./pages/Registration/Registration";

import Home from "./pages/protected/Home";
import Todos from "./pages/protected/Todos";
import Task from "./pages/protected/Task";
import { GuestOnlyRoute } from "./routes/GuestOnlyRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Statistics } from "./pages/protected/Dashboard/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  // Nur Gäste
  {
    element: <GuestOnlyRoute />,
    children: [
      { path: "/welcome", element: <Welcome /> },
      { path: "/login", element: <Login /> },
      { path: "/registration", element: <Registration /> },
    ],
  },

  // Nur eingeloggte User
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/todo", element: <Todos /> },
      { path: "/todo/:todoId", element: <Task /> },
      { path: "/dashboard", element: <Statistics /> },
      { path: "/schedule", element: <></> },
      { path: "/curricula", element: <></> },
      { path: "/time", element: <></> },
      { path: "/hallo", element: <h1>Hallo</h1> },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
