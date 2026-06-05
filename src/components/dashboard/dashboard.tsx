"use client";

import { useEffect, useState } from "react";
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

export function Dashboard() {
  const selectedFirm = useGlobalStore((state) => state.selectedFirm);

  const [loading, setLoading] = useState(true);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadGrids = async () => {
      setLoading(true);
      setSearch("");
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
              placeholder="Search grids..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 w-64 text-sm"
            />
          </div>
        </div>
        <TabsContent value="my-grids" className="mt-2">
          <DataTable columns={columns} data={filteredGrids} />
        </TabsContent>
        <TabsContent value="starred" className="mt-2">
          <DataTable columns={columns} data={starredGrids} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
