import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Building2, 
  CreditCard, 
  DollarSign, 
  Settings, 
  Users, 
  Shield,
  Crown
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { title: "Dashboard", url: "/super-admin", icon: Home },
  { title: "Gestão de Empresas", url: "/super-admin/empresas", icon: Building2 },
  { title: "Gestão de Assinaturas", url: "/super-admin/assinaturas", icon: CreditCard },
  { title: "Planos e Cobrança", url: "/super-admin/planos", icon: DollarSign },
  { title: "Financeiro", url: "/super-admin/financeiro", icon: DollarSign },
  { title: "Configurações do SaaS", url: "/super-admin/configuracoes", icon: Settings },
  { title: "Segurança", url: "/super-admin/seguranca", icon: Shield },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/super-admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar
      className={`${state === 'collapsed' ? 'w-16' : 'w-64'} border-r border-border bg-card`}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-primary font-bold text-base px-4 py-3">
            <Crown className="h-5 w-5" />
            {state !== 'collapsed' && "Super Admin"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/super-admin"}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${getNavClassName(item.url)}`}
                      onClick={() => {
                        if (isMobile) {
                          // Fechar sidebar no mobile após clique
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== 'collapsed' && (
                        <span className="truncate">{item.title}</span>
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