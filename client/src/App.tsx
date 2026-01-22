import "./App.css";
import Container from "./components/Container";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Container className="bg-white">
      <div className="bg-green-600"></div>

      <Outlet />
      <Footer />
    </Container>
  );
}

export default App;
