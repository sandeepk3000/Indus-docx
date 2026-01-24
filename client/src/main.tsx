// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SingleBlog from "./components/pages/SingleBlog";
import Home from "./components/pages/Home";

// import Carousel from "./components/pages/Carousel.tsx";
import Login from "./components/pages/Login.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

import Test from "./components/pages/Test.tsx";
import Live from "./components/pages/Live.tsx";
import Leaderboard from "./components/pages/Leaderboard.tsx";
import DashboardLayout from "./components/DashboardLayout.tsx";

import StudentTest from "./components/pages/StudentTest.tsx";
import Quizzes from "./components/pages/Quizzes.tsx";
import Quiz from "./components/pages/Quiz.tsx";
import LiveQuizManager from "./components/pages/LiveQuizManager.tsx";
import EditTest from "./components/pages/EditTest.tsx";
import StudentLive from "./components/pages/StudentLive.tsx";
import AuthLayout from "./components/AuthLayout.tsx";
import Callback from "./components/pages/Callback.tsx";
import { Navigate } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "single-blog/:id",
        element: <SingleBlog />,
      },
      {
        path: "callback",
        element: (
          <AuthLayout authentication={false}>
            <Callback />
          </AuthLayout>
        ),
      },
      {
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthLayout authentication>
        <DashboardLayout />
      </AuthLayout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="live" replace />,
      },
      {
        path: "tests",
        element: <Test />, // create,edit,delete,view
      },
      {
        path: "live",
        element: <Live />, // live tests
      },
      {
        element: <Leaderboard />,
        path: "leaderboards",
      },
      {
        path: "tests/:id/edit",
        element: <EditTest />,
      },
    ],
  },
  {
    path: "/student",
    element: (
      <AuthLayout authentication>
        <DashboardLayout />
      </AuthLayout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="live" replace />,
      },
      {
        path: "tests",
        element: <StudentTest />,
      },
      {
        path: "live",
        element: <StudentLive />,
      },
      {
        path: "leaderboards",
        element: <Leaderboard />,
      },
      {
        path: "quizzes",
        element: <Quizzes />,
      },
      {
        path: "live/quiz/:id",
        element: <LiveQuizManager />,
      },
      {
        path: "quiz/:id",
        element: <Quiz />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-oeemfegcvmdfmku4.us.auth0.com"
    clientId="6KYYfD9aZniumn2Wu5RqoSQKqFz6g3ZY"
    authorizationParams={{
      redirect_uri: window.location.origin + "/callback",
    }}
  >
    <RouterProvider router={router} />,
  </Auth0Provider>,
);
