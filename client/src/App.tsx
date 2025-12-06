import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <App1 /> },
  { path: "/about", element: <App2 /> },
]);

function App1() {
  fetch("http://localhost:5000/").then((response) => {
    console.log(response);
  });


  return (
    <>
      <Select_Study />
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
import { Select_Study } from "./componenten/Select_Study";

export default function App() {
  return <RouterProvider router={router} />;
}
