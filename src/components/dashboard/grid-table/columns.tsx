"use client";

import { Button } from "@/components/ui/button";
import { Grid } from "@/types/global-type";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function StarCell({
  starred,
  onToggle,
}: {
  starred: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="text-muted-foreground hover:text-yellow-400 transition-colors cursor-pointer"
    >
      <Star
        className={`size-4 ${starred ? "fill-yellow-400 text-yellow-400" : ""}`}
      />
    </button>
  );
}

function GridIcon({ type }: { type: string }) {
  const iconMap: Record<string, { bg: string; content: React.ReactNode }> = {
    linkedin: {
      bg: "bg-blue-600",
      content: <span className="text-white text-[9px] font-bold">in</span>,
    },
    "find-company": {
      bg: "bg-green-100",
      content: <span className="text-green-700 text-[10px]">🏢</span>,
    },
    csv: {
      bg: "bg-orange-100",
      content: <span className="text-orange-600 text-[10px]">📄</span>,
    },
    "find-people": {
      bg: "bg-purple-100",
      content: <span className="text-purple-600 text-[10px]">👥</span>,
    },
    maps: {
      bg: "bg-red-100",
      content: <span className="text-red-500 text-[10px]">📍</span>,
    },
    workbook: {
      bg: "bg-gray-100",
      content: <span className="text-gray-600 text-[10px]">📊</span>,
    },
  };

  const icon = iconMap[type] ?? iconMap["workbook"];

  return (
    <div
      className={`size-6 rounded flex items-center justify-center ${icon.bg}`}
    >
      {icon.content}
    </div>
  );
}

function EditedByCell({ name, avatar }: { name: string; avatar?: string }) {
  return (
    <div className="flex items-center gap-2 truncate">
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={24}
          height={24}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="size-6 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-semibold">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      )}
      <span>{name}</span>
    </div>
  );
}

export function columns(
  toggleStar: (id: string) => void,
  deleteGrid: (id: string) => void,
): ColumnDef<Grid>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        const handleSort = () => {
          if (!sorted) column.toggleSorting(false);
          else if (sorted === "asc") column.toggleSorting(true);
          else column.clearSorting();
        };
        return (
          <Button variant="ghost" onClick={handleSort} className="-ml-3">
            Name
            {sorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : sorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <StarCell
            starred={row.original.starred ?? false}
            onToggle={() => toggleStar(row.original.id)}
          />
          <GridIcon type={row.original.type ?? "workbook"} />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "editedBy",
      header: "Edited by",
      cell: ({ row }) => (
        <EditedByCell
          name={row.original.editedBy}
          avatar={row.original.avatar}
        />
      ),
    },
    {
      accessorKey: "lastEdited",
      header: "Last edited",
      cell: ({ row }) => {
        const raw = row.original.lastEdited;
        if (!raw) return null;
        try {
          return (
            <span className="text-muted-foreground">
              {format(new Date(raw), "dd MMM, yyyy")}
            </span>
          );
        } catch {
          return <span className="text-muted-foreground">{raw}</span>;
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                deleteGrid(row.original.id);
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
      enableSorting: false,
    },
  ];
}
