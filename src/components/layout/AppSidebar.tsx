
import React from 'react';
import {
  Calendar,
  Users,
  Settings,
  Scissors,
  FileText,
  User,
  CreditCard,
  Share2,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const adminItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: FileText,
  },
  {
    title: 'Agendamentos',
    url: '/agendamentos',
    icon: Calendar,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Funcionários',
    url: '/funcionarios',
    icon: User,
  },
  {
    title: 'Serviços',
    url: '/servicos',
    icon: Scissors,
  },
  {
    title: 'Finanças',
    url: '/financas',
    icon: CreditCard,
  },
  {
    title: 'Divulgação',
    url: '/divulgacao',
    icon: Share2,
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
  },
];

const subAdminItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: FileText,
  },
  {
    title: 'Agendamentos',
    url: '/agendamentos',
    icon: Calendar,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Funcionários',
    url: '/funcionarios',
    icon: User,
  },
  {
    title: 'Serviços',
    url: '/servicos',
    icon: Scissors,
  },
  {
    title: 'Finanças',
    url: '/financas-subadmin',
    icon: CreditCard,
  },
];

const employeeItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: FileText,
  },
  {
    title: 'Agendamentos',
    url: '/agendamentos',
    icon: Calendar,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
];

const receptionistItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: FileText,
  },
  {
    title: 'Agendamentos',
    url: '/agendamentos',
    icon: Calendar,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Serviços',
    url: '/servicos',
    icon: Scissors,
  },
];

export function AppSidebar() {
  const { employee, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen } = useSidebar();

  const getMenuItems = () => {
    switch (employee?.role) {
      case 'ADMIN':
        return adminItems;
      case 'SUBADMIN':
        return subAdminItems;
      case 'FUNCIONARIO':
        return employeeItems;
      case 'RECEPCIONISTA':
        return receptionistItems;
      default:
        return employeeItems;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(!open)}
          className="bg-background border-border"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <Sidebar 
        variant="sidebar" 
        side="left"
        className="border-r border-border bg-background w-64 md:w-64"
        collapsible="icon"
      >
        <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scissors className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Meu Salão</span>
              <span className="truncate text-xs text-muted-foreground">Sistema de Gestão</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.url)}
                      isActive={location.pathname === item.url}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {employee?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-left text-sm">
                  <span className="truncate font-medium">{employee?.name || 'Usuário'}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {employee?.role === 'ADMIN' && 'Administrador'}
                    {employee?.role === 'SUBADMIN' && 'Sub-administrador'}
                    {employee?.role === 'FUNCIONARIO' && 'Funcionário'}
                    {employee?.role === 'RECEPCIONISTA' && 'Recepcionista'}
                    {employee?.role === 'OUTRO' && (employee?.custom_role_name || 'Outro')}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleNavigation('/configuracoes-perfil')}>
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/notification-settings')}>
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
