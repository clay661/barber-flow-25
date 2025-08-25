import { 
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Scissors,
  DollarSign,
  Settings
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import barbershopLogo from "@/assets/barbershop-logo.jpg";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Funcionários", url: "/funcionarios", icon: UserCheck },
  { title: "Agendamentos", url: "/agendamentos", icon: Calendar },
  { title: "Serviços", url: "/servicos", icon: Scissors },
  { title: "Finanças", url: "/financas", icon: DollarSign },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { state, open, setOpen } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar 
      className={`${isMobile ? 'fixed z-50' : 'relative'} ${
        isMobile && open ? 'w-64' : isMobile ? 'w-0' : state === 'collapsed' ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out`}
      collapsible={isMobile ? "offcanvas" : "icon"}
      side="left"
    >
      {/* Mobile overlay */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setOpen(false)}
        />
      )}
      
      <SidebarContent className="bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border z-50">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={barbershopLogo} 
              alt="Nexio" 
              className="w-8 h-8 rounded-md flex-shrink-0"
            />
            {(state !== 'collapsed' || isMobile) && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-sidebar-foreground truncate">Nexio</h1>
                <p className="text-xs text-sidebar-foreground/70 truncate">Sistema de Gestão</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          {(state !== 'collapsed' || isMobile) && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 py-2">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`mx-2 my-1 rounded-lg transition-all duration-200 ${
                      isActive(item.url)
                        ? "bg-accent text-accent-foreground font-medium shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent hover:shadow-sm hover:translate-x-1 active:bg-sidebar-accent active:text-accent"
                    }`}
                    onClick={() => {
                      if (isMobile) {
                        setOpen(false);
                      }
                    }}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {(state !== 'collapsed' || isMobile) && (
                        <span className="font-medium truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}