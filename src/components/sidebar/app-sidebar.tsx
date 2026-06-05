"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { FirmSwitcher } from "./firm-switcher";
import {
  Book,
  BookOpen,
  ChevronUp,
  LayoutDashboard,
  Link2,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { NavMain } from "./nav-main";

export function AppSidebar() {
  const data = {
    navGroups: [
      {
        label: "Home",
        items: [
          { title: "My Dashboard", route: "/dashboard", icon: LayoutDashboard },
          {
            title: "Playbooks",
            route: "/playbooks",
            icon: Book,
            premium: true,
          },
          { title: "Integrations", route: "/integrations", icon: Link2 },
        ],
      },
      {
        label: "Other",
        items: [
          { title: "Documentation", route: "/documentation", icon: BookOpen },
          { title: "Settings", route: "/settings", icon: Settings },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-12 border-b">
        <div className="flex items-center overflow-hidden">
          <Image
            src="/letter-b-svgrepo-com.svg"
            alt="B Logo"
            width={30}
            height={30}
            priority
            className="shrink-0 dark:invert"
          />
          <h1 className="text-2xl font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">
            itscale
          </h1>
        </div>
      </SidebarHeader>

      <FirmSwitcher />

      <SidebarContent>
        <NavMain groups={data.navGroups} />
      </SidebarContent>

      <SidebarFooter className="px-2 group-data-[collapsible=icon]:hidden">
        <div className="bg-accent flex items-center justify-between px-3 py-2 rounded-md">
          <div>
            <div className="flex items-center gap-1 overflow-hidden">
              <Image
                src="/letter-b-svgrepo-com.svg"
                alt="B Logo"
                width={20}
                height={20}
                priority
                className="shrink-0 dark:invert"
              />
              <h1 className="text-lg font-semibold whitespace-nowrap">
                itscale
              </h1>
            </div>
            <p className="text-xs text-muted-foreground font-semibold">
              Get Support at <i>Bitscale</i>
            </p>
          </div>
          <ChevronUp className="h-4 w-4" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
