import { Dashboard } from "@/components/dashboard/dashboard";
import { FindPeopleSheet } from "@/components/dashboard/find-people-sheet";

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full p-4">
      <FindPeopleSheet />
      <Dashboard />
    </div>
  );
}
