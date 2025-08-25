import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTenantData, Tenant } from "@/hooks/useTenantsManagement";

interface TenantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTenantData) => Promise<void>;
  tenant?: Tenant | null;
  title: string;
  description: string;
}

export function TenantFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  tenant, 
  title, 
  description 
}: TenantFormModalProps) {
  const [formData, setFormData] = useState<CreateTenantData>({
    name: tenant?.name || '',
    email: tenant?.email || '',
    document_type: tenant?.document_type || '',
    document_number: tenant?.document_number || '',
    status: tenant?.status || 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      // Error já tratado no hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      document_type: '',
      document_number: '',
      status: 'active'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da empresa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email do Administrador *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="admin@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_type">Tipo de Documento</Label>
            <Select 
              value={formData.document_type || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_number">Número do Documento</Label>
            <Input
              id="document_number"
              value={formData.document_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, document_number: e.target.value }))}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="inactive">Suspensa</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : tenant ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}