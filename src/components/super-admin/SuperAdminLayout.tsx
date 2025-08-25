import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { SuperAdminHeader } from "./SuperAdminHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

function LayoutContent() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full flex">
      <SuperAdminSidebar />
      <div className={`min-h-screen flex flex-col flex-1 ${
        isMobile 
          ? '' 
          : state === 'collapsed' 
            ? 'ml-16' 
            : 'ml-64'
      } transition-all duration-300 ease-in-out`}>
        <SuperAdminHeader />
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-background overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function SuperAdminLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent />
    </SidebarProvider>
  );
}