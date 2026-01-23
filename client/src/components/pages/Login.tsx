import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  // 🔑 Auth0 se aaya role
  const roles = user?.["https://yourapp.com/roles"];

  // 🔁 LOGIN KE BAAD REDIRECT (YAHI ADD KARNA HAI)
  useEffect(() => {
    if (isAuthenticated && roles) {
      if (roles.includes("admin")) {
        navigate("/admin", { replace: true });
      } else if (roles.includes("student")) {
        navigate("/student", { replace: true });
      }
    }
  }, [isAuthenticated, roles, navigate]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => loginWithRedirect()}>Login with Auth0</button>
    </div>
  );
}
