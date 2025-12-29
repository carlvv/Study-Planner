import { useState } from "react";
import TextInput from "../components/Input";
import { ButtonPrimary } from "../components/Buttons";
import { LoginLayout } from "../components/layout/Login_Layout";
import useAuth from "../context/useAuth";

function Login() {
  const [studyId, setStudyId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  async function handleClick() {
    try {
      setError("");
      const res = await login(studyId, pw);
      setError(res);
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
