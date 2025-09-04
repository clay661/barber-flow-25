import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useSaaSSettings } from "@/hooks/useSuperAdminData";
import { useToast } from "@/hooks/use-toast";

interface StripeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripeConfigModal({ isOpen, onClose }: StripeConfigModalProps) {
  const { settings, updateSettings, loading } = useSaaSSettings();
  const { toast } = useToast();
  const [showPublishableKey, setShowPublishableKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [formData, setFormData] = useState({
    stripe_publishable_key: settings?.stripe_publishable_key || "",
    stripe_secret_key: settings?.stripe_secret_key || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSettings({
        ...settings,
        stripe_publishable_key: formData.stripe_publishable_key,
        stripe_secret_key: formData.stripe_secret_key,
      });
      
      toast({
        title: "Configurações salvas",
        description: "As chaves do Stripe foram configuradas com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error("Error updating Stripe settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações do Stripe.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuração Stripe</DialogTitle>
          <DialogDescription>
            Configure as chaves da API do Stripe para processar pagamentos.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              Encontre suas chaves da API no{" "}
              <a 
                href="https://dashboard.stripe.com/apikeys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                painel do Stripe
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publishable_key">Chave Publicável (pk_)</Label>
              <div className="relative">
                <Input
                  id="publishable_key"
                  type={showPublishableKey ? "text" : "password"}
                  placeholder="pk_test_..."
                  value={formData.stripe_publishable_key}
                  onChange={(e) => setFormData({ ...formData, stripe_publishable_key: e.target.value })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPublishableKey(!showPublishableKey)}
                >
                  {showPublishableKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret_key">Chave Secreta (sk_)</Label>
              <div className="relative">
                <Input
                  id="secret_key"
                  type={showSecretKey ? "text" : "password"}
                  placeholder="sk_test_..."
                  value={formData.stripe_secret_key}
                  onChange={(e) => setFormData({ ...formData, stripe_secret_key: e.target.value })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}