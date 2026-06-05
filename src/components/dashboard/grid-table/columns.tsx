"use client";

import { Button } from "@/components/ui/button";
import { Grid } from "@/types/global-type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export const columns: ColumnDef<Grid>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      const handleSort = () => {
        if (!sorted) {
          column.toggleSorting(false);
        } else if (sorted === "asc") {
          column.toggleSorting(true);
        } else {
          column.clearSorting();
        }
      };

      return (
        <Button variant="ghost" onClick={handleSort}>
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
  },
  {
    accessorKey: "editedBy",
    header: "Edited By",
  },
  {
    accessorKey: "lastEdited",
    header: "Last Edited",
  },
];
