import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-screen w-full flex-col">
        <Header />

        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}
