// Callback.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
const Callback = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(window.location.pathname);
    }
  }, [isAuthenticated]);
  return (
    <>
      <div>this is callback page</div>
    </>
  );
};

export default Callback;
