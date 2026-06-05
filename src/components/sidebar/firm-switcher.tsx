"use client";

import data from "@/data/data.json";
import { useGlobalStore } from "@/store/global-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Loader2 } from "lucide-react";

export function FirmSwitcher() {
  const selectedFirm = useGlobalStore((state) => state.selectedFirm);
  const setSelectedFirm = useGlobalStore((state) => state.setSelectedFirm);
  const hydrated = useGlobalStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <div className="h-12 border-b flex items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  const currentFirm =
    data.firms.find((firm) => firm.id === selectedFirm) ?? data.firms[0];

  return (
    <div className="h-12 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hover:bg-accent flex h-full w-full items-center justify-between px-4 transition-colors outline-none">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="truncate font-medium">{currentFirm.name}</span>
            </div>

            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64">
          {data.firms.map((firm) => (
            <DropdownMenuItem
              key={firm.id}
              onClick={() => setSelectedFirm(firm.id)}
            >
              {firm.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
