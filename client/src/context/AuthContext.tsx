import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetch_backend, fetch_backend_auth } from "../helper";
import type { Student } from "../types";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = Cookies.get("access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch_backend_auth("/auth/user");

      if (!res.ok) {
        Cookies.remove("access_token");
        setUser(null);
        return;
      }

      const json = await res.json();
      setUser(json);
    } catch {
      Cookies.remove("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (studentId: string, password: string) => {
    try {
      const res = await fetch_backend("/auth/login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ student_id: studentId, password }),
      });

      const json: { access_token?: string; msg?: string } = await res.json();

      if (res.ok && json.access_token) {
        Cookies.set("access_token", json.access_token, { expires: 1 });
        await loadUser();
        return "";
      } else {
        return json.msg ?? "Fehler beim Senden";
      }
    } catch {
      return "Unerwarteter Fehler";
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
  };

  const refresh = async () => {
    await loadUser();
  };
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
