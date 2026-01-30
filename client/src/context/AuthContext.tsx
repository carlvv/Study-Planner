import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { fetch_backend, fetch_backend_auth } from "../utils/helper";
import type { Student } from "../types";
import { AuthContext } from "./useAuth";

async function fetchUser(): Promise<Student | null> {
  const token = Cookies.get("access_token");
  if (!token) return null;

  const res = await fetch_backend_auth("/auth/user");

  if (!res.ok) {
    Cookies.remove("access_token");
    return null;
  }

  return res.json();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 ,  // Kann veraltet sein
  });

  // Login Funktion
  const loginMutation = useMutation({
    mutationFn: async ({
      studentId,
      password,
    }: {
      studentId: string;
      password: string;
    }) => {
      const res = await fetch_backend("/auth/login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          student_id: studentId,
          password,
        }),
      });

      const json: { access_token?: string; msg?: string } =
        await res.json();

      if (!res.ok || !json.access_token) {
        throw new Error(json.msg ?? "Fehler beim Senden");
      }

      Cookies.set("access_token", json.access_token, { expires: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });

  // Logout Funktion
  const logoutMutation = useMutation({
    mutationFn: async () => {
      Cookies.remove("access_token");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        isAuthenticated: !!user,
        login: async (studentId: string, password: string) => {
          try {
            await loginMutation.mutateAsync({
              studentId,
              password,
            });
            return "";
          } catch (err: any) {
            return err.message ?? "Unerwarteter Fehler";
          }
        },
        logout: async () => {
          await logoutMutation.mutateAsync();
        },
        refresh: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
