"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGlobalStore } from "@/store/global-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Briefcase,
  Globe,
  MapPin,
  Building2,
  Users,
  TrendingUp,
  Eye,
  BookmarkPlus,
  Lock,
  X,
  Bookmark,
  Trash2,
  Clock,
} from "lucide-react";
import peopleData from "@/data/people-data.json";
import Image from "next/image";
import { FilterSection, MultiSelect } from "@/lib/find-people-utils";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Person {
  id: string;
  name: string;
  title: string;
  headline: string;
  linkedinUrl: string;
  company: string;
  companyUrl: string;
  companyHeadcount: string;
  companyLocation: string;
  personLocation: string;
  managementLevel: string;
  avatar: string;
}

interface Filters {
  keyword: string;
  jobTitles: string[];
  companyWebsites: string[];
  personLocations: string[];
  companyLocations: string[];
  companyHeadcounts: string[];
  managementLevels: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: Filters;
  savedAt: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const EMPTY_FILTERS: Filters = {
  keyword: "",
  jobTitles: [],
  companyWebsites: [],
  personLocations: [],
  companyLocations: [],
  companyHeadcounts: [],
  managementLevels: [],
};

const LS_KEY = "find_people_saved_searches";

const JOB_TITLE_OPTIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Marketing Director",
  "Sales Manager",
  "Growth Manager",
  "VP of Engineering",
  "CTO",
  "Founder & CEO",
];

const COMPANY_OPTIONS = [
  "google.com",
  "stripe.com",
  "shopify.com",
  "netflix.com",
  "figma.com",
  "spotify.com",
  "klarna.com",
  "salesforce.com",
  "hubspot.com",
  "notion.so",
  "vercel.com",
  "nexusai.io",
];

const PERSON_LOCATION_OPTIONS = [
  "San Francisco, CA",
  "New York City, NY",
  "London, UK",
  "Stockholm, Sweden",
  "Toronto, Canada",
  "Boston, MA",
  "Austin, TX",
  "Los Angeles, CA",
  "Dubai, UAE",
];

const COMPANY_LOCATION_OPTIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Sweden",
  "UAE",
];

const HEADCOUNT_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "200-500",
  "1000-5000",
  "5000-10000",
  "10000+",
];

const MANAGEMENT_OPTIONS = [
  "Owner, Founder",
  "C-Suite",
  "VP",
  "Director",
  "Manager",
  "Individual Contributor",
];

const AVATAR_COLORS = [
  "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300",
  "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
  "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
  "bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300",
  "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300",
];

// ── localStorage helpers ───────────────────────────────────────────────────────
function loadSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function persistSavedSearches(searches: SavedSearch[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(searches));
}

// ── Saved Searches Popover ─────────────────────────────────────────────────────
function SavedSearchesPopover({
  onApply,
}: {
  onApply: (filters: Filters) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setOpen((o) => {
      if (!o) setSearches(loadSavedSearches());
      return !o;
    });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searches.filter((s) => s.id !== id);
    persistSavedSearches(updated);
    setSearches(updated);
  };

  const apply = (s: SavedSearch) => {
    onApply(s.filters);
    setOpen(false);
  };

  const activeCount = (f: Filters) =>
    f.jobTitles.length +
    f.companyWebsites.length +
    f.personLocations.length +
    f.companyLocations.length +
    f.companyHeadcounts.length +
    f.managementLevels.length +
    (f.keyword ? 1 : 0);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleOpen}
        className="text-xs h-8 gap-1.5"
      >
        <BookmarkPlus className="h-3.5 w-3.5" />
        Saved Search
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              Saved Searches
            </p>
            <button onClick={() => setOpen(false)}>
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>

          {searches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Bookmark className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No saved searches yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Apply filters and click &quot;Save Search&quot; to save them
                here.
              </p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {searches.map((s) => (
                <div
                  key={s.id}
                  onClick={() => apply(s)}
                  className="w-full flex items-start justify-between gap-3 px-4 py-3 hover:bg-accent transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {s.savedAt}
                      </span>
                      <span className="text-xs text-primary font-medium">
                        · {activeCount(s.filters)} filters
                      </span>
                    </div>
                    {/* Filter summary pills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {[
                        ...s.filters.jobTitles,
                        ...s.filters.personLocations,
                        ...s.filters.managementLevels,
                      ]
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]"
                          >
                            {tag}
                          </span>
                        ))}
                      {activeCount(s.filters) > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px]">
                          +{activeCount(s.filters) - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteSearch(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 hover:text-destructive text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Save Search Dialog ─────────────────────────────────────────────────────────
function SaveSearchDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    onClose();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setName("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Save this Search</DialogTitle>
          <DialogDescription>
            Give your search a name so you can quickly apply it later.
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="e.g. Senior Engineers in US"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="h-9 text-sm"
        />
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1"
          >
            Save Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
      <div className="w-28 h-28 mb-5 opacity-80">
        <Image
          src="/undraw_no-data_ig65.svg"
          alt="Under Construction"
          width={400}
          height={400}
          priority
          className="shrink-0"
        />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Start your search, preview, and import people for enrichment by applying
        any filter in the left panel.
      </p>
      <p className="text-xs text-muted-foreground/60 mt-2">
        OR import from saved search.
      </p>
    </div>
  );
}

// ── Results Table ──────────────────────────────────────────────────────────────
function ResultsTable({ people }: { people: Person[] }) {
  const avatarColor = (id: string) =>
    AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length];

  const MobileCard = ({ person }: { person: Person }) => (
    <div className="p-4 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(person.id)}`}
        >
          {person.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground truncate">
                {person.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {person.title}
              </p>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {person.managementLevel.split(",")[0]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {person.headline}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              {person.company}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {person.personLocation}
            </span>
          </div>
          <a
            href={person.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden divide-y divide-border">
        {people.map((p) => (
          <MobileCard key={p.id} person={p} />
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              {[
                "Name",
                "Title",
                "Headline",
                "LinkedIn URL",
                "Company",
                "Company URL",
                "Location",
                "Headcount",
                "Level",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {people.map((person) => (
              <tr key={person.id} className="hover:bg-accent transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(person.id)}`}
                    >
                      {person.avatar}
                    </div>
                    <span className="font-medium text-foreground text-sm">
                      {person.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                  {person.title}
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-50 text-xs">
                  <span className="line-clamp-2">{person.headline}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <a
                    href={person.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-xs hover:underline flex items-center gap-1"
                  >
                    <svg
                      className="h-3.5 w-3.5 fill-current shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    View
                  </a>
                </td>
                <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs font-medium">
                  {person.company}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <a
                    href={person.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline truncate max-w-25 block"
                  >
                    {person.companyUrl.replace("https://", "")}
                  </a>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                  {person.personLocation}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant="outline" className="text-xs font-normal">
                    {person.companyHeadcount}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge className="text-xs bg-primary/10 text-primary border-0 font-normal hover:bg-primary/20">
                    {person.managementLevel.split(",")[0]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function FindPeopleSheet() {
  const findPeopleSheetOpen = useGlobalStore(
    (state) => state.findPeopleSheetOpen,
  );
  const setFindPeopleSheetOpen = useGlobalStore(
    (state) => state.setFindPeopleSheetOpen,
  );

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [previewed, setPreviewed] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const setMultiFilter = (
    key: keyof Omit<Filters, "keyword">,
    vals: string[],
  ) => setFilters((f) => ({ ...f, [key]: vals }));

  const hasFilters =
    appliedFilters.keyword.trim() !== "" ||
    appliedFilters.jobTitles.length > 0 ||
    appliedFilters.companyWebsites.length > 0 ||
    appliedFilters.personLocations.length > 0 ||
    appliedFilters.companyLocations.length > 0 ||
    appliedFilters.companyHeadcounts.length > 0 ||
    appliedFilters.managementLevels.length > 0;

  const handleSaveSearch = (name: string) => {
    const existing = loadSavedSearches();
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters,
      savedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    persistSavedSearches([newSearch, ...existing]);
  };

  const handleApplySavedSearch = (savedFilters: Filters) => {
    setFilters(savedFilters);
    setAppliedFilters(savedFilters);
    setPreviewed(true);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPreviewed(false);
  };

  const handleSheetOpenChange = (val: boolean) => {
    if (!val) {
      setFilters(EMPTY_FILTERS);
      setAppliedFilters(EMPTY_FILTERS);
      setPreviewed(false);
      setShowFilters(true);
    }
    setFindPeopleSheetOpen(val);
  };

  const filteredPeople = useMemo(() => {
    if (!previewed || !hasFilters) return [];
    const data = peopleData as Person[];
    return data.filter((p) => {
      const kw = appliedFilters.keyword.toLowerCase();
      if (
        kw &&
        !p.name.toLowerCase().includes(kw) &&
        !p.title.toLowerCase().includes(kw) &&
        !p.headline.toLowerCase().includes(kw) &&
        !p.company.toLowerCase().includes(kw)
      )
        return false;

      if (
        appliedFilters.jobTitles.length > 0 &&
        !appliedFilters.jobTitles.some((t) =>
          p.title.toLowerCase().includes(t.toLowerCase()),
        )
      )
        return false;

      if (
        appliedFilters.companyWebsites.length > 0 &&
        !appliedFilters.companyWebsites.some(
          (w) =>
            p.companyUrl.toLowerCase().includes(w.toLowerCase()) ||
            p.company.toLowerCase().includes(w.toLowerCase()),
        )
      )
        return false;

      if (
        appliedFilters.personLocations.length > 0 &&
        !appliedFilters.personLocations.some((l) =>
          p.personLocation.toLowerCase().includes(l.toLowerCase()),
        )
      )
        return false;

      if (
        appliedFilters.companyLocations.length > 0 &&
        !appliedFilters.companyLocations.some((l) =>
          p.companyLocation.toLowerCase().includes(l.toLowerCase()),
        )
      )
        return false;

      if (
        appliedFilters.companyHeadcounts.length > 0 &&
        !appliedFilters.companyHeadcounts.includes(p.companyHeadcount)
      )
        return false;

      if (
        appliedFilters.managementLevels.length > 0 &&
        !appliedFilters.managementLevels.some((m) =>
          p.managementLevel.toLowerCase().includes(m.toLowerCase()),
        )
      )
        return false;

      return true;
    });
  }, [appliedFilters, previewed, hasFilters]);

  const handlePreview = () => {
    setAppliedFilters(filters);
    setPreviewed(true);
    setShowFilters(false);
  };

  return (
    <>
      <SaveSearchDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSaveSearch}
      />

      <Sheet open={findPeopleSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="left"
          className="w-full! max-w-full! md:w-[85dvw]! md:max-w-[85dvw]! p-0 flex flex-col overflow-hidden gap-0"
        >
          {/* ── Header ── */}
          <SheetHeader className="shrink-0 border-b border-border px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold text-foreground">
                Find People
              </SheetTitle>
              <div className="flex items-center gap-2">
                <SavedSearchesPopover onApply={handleApplySavedSearch} />
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1">
                  <Search className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                    8000/50000
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile toggle */}
            <div className="flex md:hidden mt-3 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setShowFilters(true)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                  showFilters
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                  !showFilters
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Results {previewed && `(${filteredPeople.length})`}
              </button>
            </div>
          </SheetHeader>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">
            {/* ── Left: Filters ── */}
            <aside
              className={`${
                showFilters ? "flex" : "hidden"
              } md:flex w-full md:w-75 lg:w-[320px] flex-col border-r border-border bg-background overflow-y-auto shrink-0`}
            >
              {/* Keyword */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  People Keyword
                </div>
                <Input
                  placeholder="Enter single keyword here..."
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, keyword: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              <FilterSection
                icon={Briefcase}
                label="Job Title"
                example="E.g: Manager, Software Engineer"
                activeCount={filters.jobTitles.length}
              >
                <MultiSelect
                  placeholder="Select job titles..."
                  options={JOB_TITLE_OPTIONS}
                  selected={filters.jobTitles}
                  onChange={(v) => setMultiFilter("jobTitles", v)}
                />
              </FilterSection>

              <FilterSection
                icon={Globe}
                label="Company Website"
                example="Eg: Google.com, LinkedIn.com"
                activeCount={filters.companyWebsites.length}
              >
                <MultiSelect
                  placeholder="Select company websites..."
                  options={COMPANY_OPTIONS}
                  selected={filters.companyWebsites}
                  onChange={(v) => setMultiFilter("companyWebsites", v)}
                />
              </FilterSection>

              <FilterSection
                icon={MapPin}
                label="Person Location"
                example="Eg: London, New York City"
                activeCount={filters.personLocations.length}
              >
                <MultiSelect
                  placeholder="Select person locations..."
                  options={PERSON_LOCATION_OPTIONS}
                  selected={filters.personLocations}
                  onChange={(v) => setMultiFilter("personLocations", v)}
                />
              </FilterSection>

              <FilterSection
                icon={Building2}
                label="Company Location"
                example="E.g: United States, UAE"
                activeCount={filters.companyLocations.length}
              >
                <MultiSelect
                  placeholder="Select company locations..."
                  options={COMPANY_LOCATION_OPTIONS}
                  selected={filters.companyLocations}
                  onChange={(v) => setMultiFilter("companyLocations", v)}
                />
              </FilterSection>

              <FilterSection
                icon={Users}
                label="Company Headcount"
                example="E.g: 11-50, 10000+"
                activeCount={filters.companyHeadcounts.length}
              >
                <MultiSelect
                  placeholder="Select headcount ranges..."
                  options={HEADCOUNT_OPTIONS}
                  selected={filters.companyHeadcounts}
                  onChange={(v) => setMultiFilter("companyHeadcounts", v)}
                />
              </FilterSection>

              <FilterSection
                icon={TrendingUp}
                label="Management Level"
                example="E.g: Owner, Founder"
                activeCount={filters.managementLevels.length}
              >
                <MultiSelect
                  placeholder="Select management levels..."
                  options={MANAGEMENT_OPTIONS}
                  selected={filters.managementLevels}
                  onChange={(v) => setMultiFilter("managementLevels", v)}
                />
              </FilterSection>

              <div className="flex-1" />

              {/* Action buttons */}
              <div className="sticky bottom-0 border-t border-border bg-background p-4 space-y-2">
                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="w-full h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear All Filters
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSaveDialogOpen(true)}
                    disabled={!hasFilters}
                    className="flex-1 h-9 text-xs gap-1.5"
                  >
                    <BookmarkPlus className="h-3.5 w-3.5" />
                    Save Search
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePreview}
                    className="flex-1 h-9 text-xs gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview Result
                  </Button>
                </div>
              </div>
            </aside>

            {/* ── Right: Results ── */}
            <main
              className={`${
                !showFilters ? "flex" : "hidden"
              } md:flex flex-1 flex-col overflow-hidden bg-background`}
            >
              <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-background shrink-0">
                <p className="text-sm text-muted-foreground">
                  {previewed ? (
                    <>
                      Found{" "}
                      <span className="font-semibold text-foreground">
                        {filteredPeople.length}
                      </span>{" "}
                      {filteredPeople.length === 1 ? "person" : "people"}
                      {hasFilters && " matching your filters"}
                    </>
                  ) : (
                    "Found 0 people. Click preview to view results"
                  )}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1">
                  <Lock className="h-3 w-3 shrink-0" />
                  <span>
                    Unlock{" "}
                    <strong className="font-semibold">100,000 leads</strong>{" "}
                    with Enterprise Plan
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {!previewed || filteredPeople.length === 0 ? (
                  <EmptyState />
                ) : (
                  <ResultsTable people={filteredPeople} />
                )}
              </div>
            </main>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
