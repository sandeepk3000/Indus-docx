import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  // 🔑 Auth0 se aaya role
  const roles = user?.["https://yourapp.com/roles"];

  // 🔁 LOGIN KE BAAD REDIRECT (YAHI ADD KARNA HAI)
  useEffect(() => {
    if (!isAuthenticated) {
      alert("Please login to continue");
      loginWithRedirect();
    } else {
      if (roles?.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [isAuthenticated]);

  if (isLoading) return <Loading text="Loading...." />;
}
