import { ButtonPrimary } from "../componenten/Buttons";
import { H3 } from "../componenten/Headlines";
import Layout from "../componenten/layout/Login_Layout";

function Login() {
  return (
    <Layout subtext="Willkommen zum Study-Planner!">
      <ButtonPrimary to="1">Login</ButtonPrimary>
      <H3 classname="text-gray-300"> Oder </H3>
      <ButtonPrimary to="2">Registrieren</ButtonPrimary>
    </Layout>
  );
}

export default Login;
