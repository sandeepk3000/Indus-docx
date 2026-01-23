import { BookOpenCheck, Puzzle, Radio, Trophy } from "lucide-react";
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
import { useAuth0 } from "@auth0/auth0-react";
const adminItems = [
  {
    title: "Live",
    url: "/admin/live",
    icon: Radio,
  },
  {
    title: "Test",
    url: "/admin/tests",
    icon: BookOpenCheck,
  },
  {
    title: "Leaderboard",
    url: "/admin/leaderboards",
    icon: Trophy,
  },
];
const studentItems = [
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
  const { user } = useAuth0();
  const roles = user?.["https://indusdocx.com/roles"];
  const items = roles?.includes("admin") ? adminItems : studentItems;
  const { setOpen, isMobile, open, setOpenMobile } = useSidebar();
  const handleSidebarOpen = () => {
    if (isMobile) {
      setOpenMobile(!open);
    } else {
      setOpen(!open);
    }
  };
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
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
