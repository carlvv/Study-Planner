import useAuth from "../../hooks/useAuth";

function Home() {
  const isAuth = useAuth();

  if (!isAuth) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Willkommen!</p>
    </div>
  );
}

export default Home;
