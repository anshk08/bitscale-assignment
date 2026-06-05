"use client";
import { SidebarTrigger } from "./ui/sidebar";
import { LogOut, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <header className="sticky top-0 z-50 h-12 border-b bg-background flex items-center justify-between md:justify-end">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-2 pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="cursor-pointer">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex items-center justify-between focus:bg-transparent data-highlighted:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch
                className="cursor-pointer"
                checked={isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
