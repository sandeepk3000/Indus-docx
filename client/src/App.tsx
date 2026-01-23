import "./App.css";
import Container from "./components/Container";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  return (
    <Container className="bg-white">
      <div className="bg-green-600"></div>
      <Navbar
        isLoggedIn={isAuthenticated}
        onLogin={() => loginWithRedirect()}
        onLogout={() => logout()}
        user={user}
      />

      <Outlet />
      <Footer />
    </Container>
  );
}

export default App;
