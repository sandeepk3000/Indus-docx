// Callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// import { useLocation } from "react-router-dom";
import Loading from "../Loading";
const Callback = () => {
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const roles = user?.["https://indusdocx.com/roles"];
  useEffect(() => {
    if (isAuthenticated) {
      if (roles?.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } else {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Loading />
    </>
  );
};

export default Callback;
