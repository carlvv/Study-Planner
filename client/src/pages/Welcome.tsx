import { ButtonPrimary } from "../componenten/Buttons";
import { H3 } from "../componenten/Headlines";
import Layout from "../componenten/layout/Login_Layout";

function Welcome() {
  return (
    <Layout subtext="Willkommen zum Study-Planner!">
      <ButtonPrimary to="/login">Login</ButtonPrimary>
      <H3 classname="text-gray-300"> Oder </H3>
      <ButtonPrimary to="/registration">Registrieren</ButtonPrimary>
    </Layout>
  );
}

export default Welcome;
