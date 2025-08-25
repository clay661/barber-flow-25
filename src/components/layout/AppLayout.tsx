import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

function LayoutContent() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full">
      <AppSidebar />
      <div className={`min-h-screen flex flex-col ${
        isMobile 
          ? '' 
          : state === 'collapsed' 
            ? 'lg:ml-16' 
            : 'lg:ml-64'
      } transition-all duration-300 ease-in-out`}>
        <Header />
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-background overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent />
    </SidebarProvider>
  );
}