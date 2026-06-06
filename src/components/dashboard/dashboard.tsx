"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Loader2, Plus, School, Search, User } from "lucide-react";

import data from "@/data/data.json";
import { useGlobalStore } from "@/store/global-store";
import { Grid } from "@/types/global-type";
import { Button } from "../ui/button";
import { Latest } from "./latest";
import { ProductDemo } from "./product-demo";
import { DataTable } from "./grid-table/data-table";
import { columns } from "./grid-table/columns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const deletedIds = new Set<string>();
const starredOverrides: Record<string, boolean> = {};

export function Dashboard() {
  const { setFindPeopleSheetOpen, selectedFirm } = useGlobalStore();
  const [loading, setLoading] = useState(true);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadGrids = async () => {
      setLoading(true);
      setSearch("");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const firm = data.firms.find((firm) => firm.id === selectedFirm);
      if (!cancelled) {
        const freshGrids = (firm?.grids ?? [])
          .filter((g) => !deletedIds.has(g.id))
          .map((g) => ({
            ...g,
            starred: Object.prototype.hasOwnProperty.call(
              starredOverrides,
              g.id,
            )
              ? starredOverrides[g.id]
              : g.starred,
          }));
        setGrids(freshGrids);
        setLoading(false);
      }
    };

    loadGrids();
    return () => {
      cancelled = true;
    };
  }, [selectedFirm]);

  const toggleStar = useCallback((id: string) => {
    setGrids((prev) => {
      const updated = prev.map((g) =>
        g.id === id ? { ...g, starred: !g.starred } : g,
      );
      const toggled = updated.find((g) => g.id === id);
      if (toggled) starredOverrides[id] = toggled.starred;
      return updated;
    });
  }, []);

  const deleteGrid = useCallback((id: string) => {
    deletedIds.add(id);
    setGrids((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const cols = useMemo(
    () => columns(toggleStar, deleteGrid),
    [toggleStar, deleteGrid],
  );

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  const filteredGrids = grids.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()),
  );
  const starredGrids = filteredGrids.filter((g) => g.starred);

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
            disabled
          >
            <School className="size-4 text-green-600" />
            Find Companies
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => setFindPeopleSheetOpen(true)}
          >
            <User className="size-4 text-purple-600" />
            Find People
          </Button>
          <Button className="flex items-center justify-center gap-2" disabled>
            <Plus className="size-4" />
            New Grid
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Latest />
        <ProductDemo />
      </div>
      <Tabs defaultValue="my-grids">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <TabsList className="bg-transparent" variant="line">
            <TabsTrigger
              value="my-grids"
              className="p-4 [&::after]:bg-blue-500"
            >
              My Grids
            </TabsTrigger>
            <TabsTrigger value="starred" className="p-4 [&::after]:bg-blue-500">
              Starred
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search grids and workbooks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 w-80 text-sm"
            />
          </div>
        </div>
        <TabsContent value="my-grids" className="mt-2">
          <DataTable columns={cols} data={filteredGrids} />
        </TabsContent>
        <TabsContent value="starred" className="mt-2">
          <DataTable columns={cols} data={starredGrids} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
