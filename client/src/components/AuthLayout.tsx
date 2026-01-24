import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Loading from "./Loading";
import { type ReactNode } from "react";
interface AuthLayoutProps {
   children: ReactNode;
   authentication?: boolean;
}

const AuthLayout = ({ children, authentication = true }: AuthLayoutProps) => {
   const { isAuthenticated, user, isLoading, loginWithRedirect, logout } =
      useAuth0();
   const location = useLocation();

   if (isLoading) return <Loading />;
   if (authentication && isAuthenticated !== authentication) {
      alert("Please login to access this page");
      loginWithRedirect({
         appState: {
            returnTo: location.pathname,
         },
      });
   }
   if (!authentication && isAuthenticated !== authentication) {
      alert("You are already logged in");
      return <>{children}</>;
   }
   if (authentication && isAuthenticated === authentication) {
      alert("You are already logged in");
      return (
         <>
            <Navbar
               isLoggedIn={isAuthenticated}
               onLogin={() => loginWithRedirect()}
               onLogout={() => logout()}
               user={user}
            />
            {children}
         </>
      );
   } else {
      return <>{children}</>;
   }
};

export default AuthLayout;
