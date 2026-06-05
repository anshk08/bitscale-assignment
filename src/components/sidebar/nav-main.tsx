"use client";

import { Rocket, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  route: string;
  icon?: LucideIcon;
  premium?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel className="text-xs text-muted-foreground font-medium px-2 mb-1">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = pathname === item.route;
              return (
                <SidebarMenuItem
                  key={item.route}
                  className="flex items-center justify-between"
                >
                  <SidebarMenuButton
                    onClick={() => {
                      router.push(item.route);
                      setOpenMobile(false);
                    }}
                    disabled={item.premium}
                    tooltip={item.title}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-2 w-full transition-colors  cursor-pointer",
                      isActive
                        ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 rounded-l-none font-medium dark:bg-blue-950 dark:text-blue-400 hover:text-blue-600"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-blue-500"
                              : "text-muted-foreground",
                          )}
                        />
                      )}
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
                      )}
                    </div>
                  </SidebarMenuButton>
                  {item.premium && (
                    <div className="px-2 py-1 rounded-xl flex items-center justify-center bg-yellow-100 text-yellow-400">
                      <Rocket className="size-4" />
                    </div>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
