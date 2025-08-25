import { Button } from "@/components/ui/button";
import { LogOut, Crown } from "lucide-react";
import { useSuperAuth } from "@/hooks/useSuperAuth";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SuperAdminHeader() {
  const { superAdmin, logout } = useSuperAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">Painel Super Admin</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Olá, {superAdmin?.name}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  );
}