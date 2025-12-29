import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { fetch_backend_auth } from "../helper";
import type { Student } from "../types";

const useAuth = (cookieName = "access_token") => {
  const navigate = useNavigate();

  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get(cookieName);

    if (!token) {
      setLoading(false);
      navigate("/welcome");
      return;
    }

    (async () => {
      try {
        const res = await fetch_backend_auth("/auth/user");

        if (!res.ok) {
          Cookies.remove(cookieName);
          navigate("/welcome");
          return;
        }
        
        const json = await res.json();
        setUser(json);
      } catch {
        Cookies.remove(cookieName);
        navigate("/welcome");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, cookieName]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
};

export default useAuth;
