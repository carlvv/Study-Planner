import { useState } from "react";
import TextInput from "../componenten/Input";
import LoginLayout from "../componenten/layout/Login_Layout";
import { ButtonPrimary } from "../componenten/Buttons";
import { fetch_backend } from "../helper";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Login() {
  const [studyId, setStudyId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleClick() {
    try {
      setError("");
      const res = await fetch_backend("/auth/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ student_id: studyId, password: pw }),
      });

      const json = await res.json();

      if (res.ok && json.access_token) {
        Cookies.set("access_token", json.access_token, { expires: 1 });
        navigate("/");
      } else {
        setError(json.msg || "Login fehlgeschlagen");
        console.error("Login fehlgeschlagen:", json);
      }
    } catch (err) {
      console.error(err);
      setError("Ein unerwarteter Fehler ist aufgetreten");
    }
  }

  return (
    <LoginLayout subtext="Willkommen zum Study-Planner!">
      <TextInput
        label="Deine Matrikelnummer:"
        placeholder="Bsp: 105421"
        value={studyId}
        onChange={setStudyId}
      />
      <TextInput
        label="Deine Passwort:"
        placeholder="Bsp: passwort123"
        type="password"
        value={pw}
        onChange={setPw}
      />
      <ButtonPrimary onClick={handleClick}>Login</ButtonPrimary>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </LoginLayout>
  );
}

export default Login;
