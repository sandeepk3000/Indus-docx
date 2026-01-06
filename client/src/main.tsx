import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SingleBlog from "./components/pages/SingleBlog";
import Home from "./components/pages/Home";
import MakeTest from "./components/pages/MakeTest";
import Quiz from "./components/pages/Quiz.tsx";
import Admin from "./components/pages/Admin.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/single-blog/:id",
        element: <SingleBlog />,
      },
      {
        path: "/make-test",
        element: <MakeTest />,
      },
      {
         path: "/admin",
        element: <Admin />
      },
      {
        path: "/quiz",
        element: <Quiz />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
