import "./App.css";
import Container from "./components/Container";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <Container className="bg-white">
      <Outlet />
      <Footer />
    </Container>
  );
}

export default App;
