import { Button_Primary } from "../componenten/Buttons";
import { H3 } from "../componenten/Headlines";
import Layout from "../componenten/Login_Layout";

function Login() {
  return (
    <Layout subtext="Willkommen zum Study-Planner!">
      <Button_Primary to="1">Login</Button_Primary>
      <H3 classname="text-gray-300"> Oder </H3>
      <Button_Primary to="2">Registrieren</Button_Primary>
    </Layout>
  );
}

export default Login;
