
import { Calendar, Users, Scissors, Settings, LayoutDashboard, Share2, UserCheck, DollarSign } from 'lucide-react';
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, Sidebar, SidebarHeader } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const getMenuItemsByRole = (role: string) => {
  console.log('getMenuItemsByRole called with role:', role);
  
  const commonItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
  ];

  switch (role) {
    case 'ADMIN':
      return [
        ...commonItems,
        {
          title: "Clientes",
          url: "/clientes",
          icon: Users,
        },
        {
          title: "Funcionários",
          url: "/funcionarios",
          icon: UserCheck,
        },
        {
          title: "Agendamentos",
          url: "/agendamentos",
          icon: Calendar,
        },
        {
          title: "Serviços",
          url: "/servicos",
          icon: Scissors,
        },
        {
          title: "Financeiro",
          url: "/financas",
          icon: DollarSign,
        },
        {
          title: "Divulgação",
          url: "/divulgacao",
          icon: Share2,
        },
        {
          title: "Configurações",
          url: "/configuracoes",
          icon: Settings,
        },
      ];
    
    case 'SUBADMIN':
      return [
        ...commonItems,
        {
          title: "Clientes",
          url: "/clientes",
          icon: Users,
        },
        {
          title: "Funcionários",
          url: "/funcionarios",
          icon: UserCheck,
        },
        {
          title: "Agendamentos",
          url: "/agendamentos",
          icon: Calendar,
        },
        {
          title: "Serviços",
          url: "/servicos",
          icon: Scissors,
        },
        {
          title: "Financeiro",
          url: "/financas-subadmin",
          icon: DollarSign,
        },
        {
          title: "Configurações",
          url: "/perfil",
          icon: Settings,
        },
      ];
    
    case 'FUNCIONARIO':
    case 'OUTRO':
      return [
        ...commonItems,
        {
          title: "Meus Clientes",
          url: "/clientes",
          icon: Users,
        },
        {
          title: "Meus Agendamentos",
          url: "/agendamentos",
          icon: Calendar,
        },
        {
          title: "Configurações",
          url: "/perfil",
          icon: Settings,
        },
      ];
    
    case 'RECEPCIONISTA':
      return [
        ...commonItems,
        {
          title: "Clientes",
          url: "/clientes",
          icon: Users,
        },
        {
          title: "Agendamentos",
          url: "/agendamentos",
          icon: Calendar,
        },
        {
          title: "Configurações",
          url: "/perfil",
          icon: Settings,
        },
      ];
    
    default:
      return commonItems;
  }
};

export function AppSidebar() {
  const { employee } = useAuth();
  const location = useLocation();

  console.log('AppSidebar - employee:', employee);
  console.log('AppSidebar - employee role:', employee?.role);

  if (!employee) {
    return null;
  }

  const menuItems = getMenuItemsByRole(employee.role);
  console.log('AppSidebar - menuItems:', menuItems);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Nexio</span>
            <span className="truncate text-xs text-muted-foreground">
              {employee.name}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
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
