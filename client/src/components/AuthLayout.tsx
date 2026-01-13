import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
export interface AuthLayoutProps {
   children: React.ReactNode;
   authentication?: boolean;
}
const AuthLayout = ({ children, authentication = true }: AuthLayoutProps) => {
   const location = useLocation();
   const navigate = useNavigate();
   const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
   console.log(isAuthenticated, isLoading);
   console.log(location.pathname, location.search);

   if (isLoading) {
      return <div>Loading.dfgd..</div>;
      // retun
   }
   if (authentication && isAuthenticated !== authentication) {
      loginWithRedirect({
         appState: {
            returnTo: location.pathname + location.search,
         },
      });
   }
   if (!authentication && isAuthenticated !== authentication) {
      console.log("here");
      navigate("/");
   }
   if (authentication && isAuthenticated === authentication) {
      return <>{children}</>;
   }
};
export default AuthLayout;
