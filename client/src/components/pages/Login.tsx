// pages/Login.jsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: "/dashboard", // login ke baad
        },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  return <p>Redirecting to login...</p>;
};

export default Login;
