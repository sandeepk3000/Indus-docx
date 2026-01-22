import { BookOpenCheck, Puzzle, Home, Radio } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
// const items = [
//   {
//     title: "Home",
//     url: "/admin",
//     icon: Home,
//   },
//   {
//     title: "Live",
//     url: "/admin/live",
//     icon: Radio,
//   },
//   {
//     title: "Test",
//     url: "/admin/tests",
//     icon: BookOpenCheck,
//   },
//   {
//     title: "Leaderboard",
//     url: "/admin/leaderboards",
//     icon: Trophy,
//   },
// ];
const studentItems = [
  {
    title: "Home",
    url: "/student",
    icon: Home,
  },
  {
    title: "Live",
    url: "/student/live",
    icon: Radio,
  },
  {
    title: "Test",
    url: "/student/tests",
    icon: BookOpenCheck,
  },
  {
    title: "Quiz",
    url: "/student/quizzes",
    icon: Puzzle,
  },
];

export function AppSidebar() {
  const { setOpen, isMobile, open, setOpenMobile } = useSidebar();
  const handleSidebarOpen = () => {
    if (isMobile) {
      setOpenMobile(!open);
    } else {
      setOpen(!open);
    }
  };
  return (
    <Sidebar variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={handleSidebarOpen} asChild>
                      <Link to={item.url}>
                        <item.icon />

                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
