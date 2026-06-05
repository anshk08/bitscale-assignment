"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import data from "@/data/data.json";
import { useGlobalStore } from "@/store/global-store";
import { Grid } from "@/types/global-type";

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
    <div className="w-full">
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
