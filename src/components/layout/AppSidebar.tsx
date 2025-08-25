import { 
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Scissors,
  DollarSign,
  Settings,
  Share2
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
import { useAuth } from "@/hooks/useAuth";
import nexioLogo from "@/assets/nexio-logo.png";

const getMenuItemsByRole = (role: string) => {
  const baseItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
  ];

  if (role === 'ADMIN' || role === 'SUBADMIN') {
    return [
      ...baseItems,
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Funcionários", url: "/funcionarios", icon: UserCheck },
      { title: "Agendamentos", url: "/agendamentos", icon: Calendar },
      { title: "Serviços", url: "/servicos", icon: Scissors },
      { title: "Finanças", url: "/financas", icon: DollarSign },
      { title: "Divulgação", url: "/divulgacao", icon: Share2 },
      { title: "Configurações", url: "/configuracoes", icon: Settings },
    ];
  }

  if (role === 'FUNCIONARIO') {
    return [
      ...baseItems,
      { title: "Meus Clientes", url: "/clientes", icon: Users },
      { title: "Meus Agendamentos", url: "/agendamentos", icon: Calendar },
      { title: "Configurações", url: "/perfil", icon: Settings },
    ];
  }

  if (role === 'RECEPCIONISTA') {
    return [
      ...baseItems,
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Agendamentos", url: "/agendamentos", icon: Calendar },
      { title: "Serviços", url: "/servicos", icon: Scissors },
      { title: "Configurações", url: "/perfil", icon: Settings },
    ];
  }

  return baseItems;
};

export function AppSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { state, open, setOpen } = useSidebar();
  const { employee } = useAuth();
  
  const menuItems = getMenuItemsByRole(employee?.role || 'FUNCIONARIO');

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      
      <Sidebar 
        className={`${
          isMobile 
            ? `fixed left-0 top-0 h-screen z-50 transform transition-transform duration-300 ease-in-out ${
                open ? 'translate-x-0' : '-translate-x-full'
              } w-64`
            : `fixed left-0 top-0 h-screen z-30 transform transition-all duration-300 ease-in-out ${
                state === 'collapsed' ? 'w-16' : 'w-64'
              }`
        }`}
        collapsible={isMobile ? "offcanvas" : "icon"}
        side="left"
      >
        <SidebarContent className="bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border h-full overflow-y-auto">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={nexioLogo} 
              alt="Nexio" 
              className="w-8 h-8 object-contain flex-shrink-0"
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
    </>
  );
}