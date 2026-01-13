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
import AuthLayout from "./components/AuthLayout.tsx";
import Callback from "./components/pages/Callback.tsx";
import { Navigate } from "react-router-dom";
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
        element: (
          <AuthLayout authentication>
            <Admin />
          </AuthLayout>
        ),
      },
      {
        path: "/quiz",
        element: (
          <AuthLayout authentication>
            <Quiz />
          </AuthLayout>
        ),
      },
      {
        path: "/c",
        element: <Carousel />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/callback",
        element: <Callback />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-oeemfegcvmdfmku4.us.auth0.com"
    clientId="l5KjVAQASvrdLcCVQeJSFAmixTCg3SOj"
    authorizationParams={{
      redirect_uri:
        "https://313a2eae-d86f-4e46-b8dd-da27c7219c41-00-2igpp3ubm6gg8.sisko.replit.dev/callback",
    }}
  >
    <RouterProvider router={router} />,
  </Auth0Provider>,
);
