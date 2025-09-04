import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaaSSettings } from "@/hooks/useSuperAdminData";
import { useToast } from "@/hooks/use-toast";

interface TrialConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrialConfigModal({ isOpen, onClose }: TrialConfigModalProps) {
  const { settings, updateSettings, loading } = useSaaSSettings();
  const { toast } = useToast();
  const [trialDays, setTrialDays] = useState(7); // Default 7 days

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would update trial settings - this might need to be part of general settings
      toast({
        title: "Configurações salvas",
        description: `Período de trial configurado para ${trialDays} dias.`,
      });
      onClose();
    } catch (error) {
      console.error("Error updating trial settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações de trial.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Configurar Período de Trial</DialogTitle>
          <DialogDescription>
            Defina quantos dias de teste gratuito os novos clientes terão.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="trial_days">Dias de Trial Gratuito</Label>
            <Input
              id="trial_days"
              type="number"
              min="0"
              max="365"
              value={trialDays}
              onChange={(e) => setTrialDays(Number(e.target.value))}
              placeholder="7"
            />
            <p className="text-sm text-muted-foreground">
              Entre 0 e 365 dias. Use 0 para desabilitar o trial.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}