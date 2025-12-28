import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useAuth = (cookieName = "access_token") => {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookie = Cookies.get(cookieName);

    if (!cookie) {
      navigate("/welcome", { replace: true });
    }
  }, [navigate, cookieName]);

  return Cookies.get(cookieName) !== undefined;
};

export default useAuth;
