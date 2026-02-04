import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Registration from "./pages/Registration/Registration";

import Home from "./pages/protected/Home";
import { GuestOnlyRoute } from "./routes/GuestOnlyRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Statistics } from "./pages/protected/Dashboard/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Schedule } from "./pages/protected/Schedule";
import { ScheduleSettings } from "./pages/protected/Schedule/Settings/Settings";
import { Curricula } from "./pages/protected/Curricula/Curricula";
import Todos from "./pages/protected/Todos/Todos";
import Tasks from "./pages/protected/Todos/Task";
import Timer from "./pages/protected/Timer";
import { Profile } from "./pages/protected/Profile";

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
      { path: "/profile", element: <Profile /> },
      { path: "/todo", element: <Todos /> },
      { path: "/todo/:todoId", element: <Tasks /> },
      { path: "/dashboard", element: <Statistics /> },
      { path: "/schedule", element: <Schedule /> },
      { path: "/schedule/settings", element: <ScheduleSettings /> },
      { path: "/curricula", element: <Curricula /> },
      { path: "/timer", element: <Timer/> },
      { path: "/timer/:subject", element: <Timer/> },
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
