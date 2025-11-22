import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <App1 /> },
  { path: "/about", element: <App2 /> },
]);

function App1() {
  return (
    <>
      Seite 1<Link to={"/about"}>Link</Link>
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

import "./App.css";

export default function App() {
  return <RouterProvider router={router} />;
}
