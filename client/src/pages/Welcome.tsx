import { ButtonPrimary } from "../components/Buttons";
import { H3 } from "../components/Headlines";
import { LoginLayout } from "../components/layout/Login_Layout";

function Welcome() {
  return (
    <LoginLayout subtext="Willkommen zum Study-Planner!">
      <ButtonPrimary to="/login">Login</ButtonPrimary>
      <H3 classname="text-gray-300"> Oder </H3>
      <ButtonPrimary to="/registration">Registrieren</ButtonPrimary>
    </LoginLayout>
  );
}

export default Welcome;
