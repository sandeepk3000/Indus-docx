import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
interface Auth0ProviderWithNavigateProps {
  children: ReactNode;
}
function Auth0ProviderWithNavigate({
  children,
}: Auth0ProviderWithNavigateProps) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || "/");
  };

  return (
    <Auth0Provider
      domain="dev-oeemfegcvmdfmku4.us.auth0.com"
      clientId="l5KjVAQASvrdLcCVQeJSFAmixTCg3SOj"
      authorizationParams={{
        redirect_uri:
          "https://313a2eae-d86f-4e46-b8dd-da27c7219c41-00-2igpp3ubm6gg8.sisko.replit.dev",
      }}
      onRedirectCallback={(appState) => onRedirectCallback(appState)}
    >
      {children}
    </Auth0Provider>
  );
}
export default Auth0ProviderWithNavigate;
