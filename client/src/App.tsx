import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Select_Study } from "./componenten/Select_Study";
import { fetch_backend } from "./helper";
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <App1 /> },
  { path: "/about", element: <App2 /> },
]);

function App1() {
  fetch_backend("/protected")
    .then((res) => res.json())
    .then((data) => console.log(data))

  return (
    <>
      <Select_Study /> 2
    </>
  );
}

function App2() {
  return (
    <>
      Seite 2<Link to={"/"}>Link</Link>
    </>
  );
}



export default function App() {
  return <RouterProvider router={router} />;
}
