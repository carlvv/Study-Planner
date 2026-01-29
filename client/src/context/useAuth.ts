import { createContext, useContext } from "react";
import type { Student } from "../types";

type AuthContextType = {
  user: Student | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (studentId: string, password: string) => Promise<string>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
export const AuthContext = createContext<AuthContextType | null>(null);
