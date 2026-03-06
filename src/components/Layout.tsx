import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import ProjectSwitcher from "@/components/ProjectSwitcher";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className={`h-12 flex items-center justify-between border-b border-border px-4 ${isHome ? "lg:hidden" : ""}`}>
            <SidebarTrigger className="lg:hidden" />
            {!isHome && <ProjectSwitcher />}
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
