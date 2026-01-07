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
import Carousel from "./components/pages/Carousel.tsx";
import Login from "./components/pages/Login.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
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
        element: <Admin />,
      },
      {
        path: "/quiz",
        element: <Quiz />,
      },
      {
        path: "/c",
        element: <Carousel />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-oeemfegcvmdfmku4.us.auth0.com"
    clientId="l5KjVAQASvrdLcCVQeJSFAmixTCg3SOj"
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <RouterProvider router={router} />,
  </Auth0Provider>,
);
