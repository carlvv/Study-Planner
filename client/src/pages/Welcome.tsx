import { ButtonPrimary } from "../components/Buttons";
import { LoginLayout } from "../components/layout/Login_Layout";

function Welcome() {
  return (
    <LoginLayout subtext="Willkommen zum Study-Planner!">
      <ButtonPrimary to="/login">Login</ButtonPrimary>
      <p className="text-gray-500">oder</p>
      <ButtonPrimary to="/registration">Registrieren</ButtonPrimary>
    </LoginLayout>
  );
}

export default Welcome;
