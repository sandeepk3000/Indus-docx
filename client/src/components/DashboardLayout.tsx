import Container from "./Container";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "../App.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <Container className="bg-white">
        <div className="bg-green-600"></div>

        <AppSidebar />
        <SidebarTrigger />
        <Outlet />
        <Footer />
      </Container>
    </SidebarProvider>
  );
}

export default DashboardLayout;
