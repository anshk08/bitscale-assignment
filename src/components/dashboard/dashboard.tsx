"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, School, User } from "lucide-react";

import data from "@/data/data.json";
import { useGlobalStore } from "@/store/global-store";
import { Grid } from "@/types/global-type";
import { Button } from "../ui/button";
import { Latest } from "./latest";
import { ProductDemo } from "./product-demo";

export function Dashboard() {
  const selectedFirm = useGlobalStore((state) => state.selectedFirm);

  const [loading, setLoading] = useState(true);
  const [grids, setGrids] = useState<Grid[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadGrids = async () => {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const firm = data.firms.find((firm) => firm.id === selectedFirm);

      if (!cancelled) {
        setGrids(firm?.grids ?? []);
        setLoading(false);
      }
    };

    loadGrids();

    return () => {
      cancelled = true;
    };
  }, [selectedFirm]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex-row items-start md:items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Welcome Back, Yash!</h1>
          <p className="text-muted-foreground">
            Here&apos;s your daily scoop on Bitscale!
          </p>
        </div>
        <div className="flex items-center justify-start md:justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <School className="size-4 text-green-600" />
            Find Companies
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <User className="size-4 text-purple-600" />
            Find People
          </Button>
          <Button className="flex items-center justify-center gap-2">
            <Plus className="size-4" />
            New Grid
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Latest />
        <ProductDemo />
      </div>
      <div className="space-y-4">
        {grids.map((grid) => (
          <div key={grid.name} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{grid.name}</h3>

              {grid.starred && (
                <span className="text-sm text-yellow-500">★</span>
              )}
            </div>

            <p className="text-muted-foreground text-sm">
              Edited by {grid.editedBy}
            </p>

            <p className="text-muted-foreground text-sm">
              Last edited {new Date(grid.lastEdited).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
