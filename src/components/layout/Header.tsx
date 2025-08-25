import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { User, Settings, LogOut, Bell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();
  const { state } = useSidebar();

  return (
    <header className="border-b border-border px-3 sm:px-4 md:px-6 py-3 md:py-4 bg-card sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <SidebarTrigger className="hover-glow" />
          {!isMobile && (
            <h2 className="text-lg md:text-xl font-semibold text-card-foreground">
              Sistema de Gestão - Nexio
            </h2>
          )}
          {isMobile && (
            <h2 className="text-lg font-semibold text-card-foreground">
              Nexio
            </h2>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notificações */}
          <Button variant="ghost" size="icon" className="hover-glow h-8 w-8 md:h-10 md:w-10">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full hover-glow">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Administrador</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@nexio.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover-darken">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover-darken">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover-darken">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}