import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Link, Copy, Eye, DollarSign, Users, MousePointer } from "lucide-react";
import { useAffiliates } from "@/hooks/useSuperAdminData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminAfiliados() {
  const { affiliates, loading, createAffiliate, updateAffiliate, deleteAffiliate } = useAffiliates();
  const { toast } = useToast();
  const [programActive, setProgramActive] = useState(true);
  const [showNewAffiliateForm, setShowNewAffiliateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    referral_code: '',
    commission_rate: 15
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.referral_code) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAffiliate({
        name: formData.name,
        email: formData.email,
        referral_code: formData.referral_code,
        commission_rate: formData.commission_rate,
        status: 'active'
      });
      
      setFormData({
        name: '',
        email: '',
        referral_code: '',
        commission_rate: 15
      });
      setShowNewAffiliateForm(false);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Copiado!",
      description: "Link de afiliado copiado para a área de transferência",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o afiliado ${name}?`)) {
      await deleteAffiliate(id);
    }
  };

  const toggleAffiliateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await updateAffiliate(id, { status: newStatus as 'active' | 'paused' | 'inactive' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Programa de Afiliados</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie parceiros e links de afiliados
          </p>
        </div>
        <Button onClick={() => setShowNewAffiliateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Afiliado
        </Button>
      </div>

      {/* Status do Programa */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Programa de Afiliados</CardTitle>
          <CardDescription>
            Configure se o programa de afiliados está ativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="affiliate-program">Programa Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que afiliados ganhem comissões por indicações
              </p>
            </div>
            <Switch 
              id="affiliate-program" 
              checked={programActive} 
              onCheckedChange={setProgramActive}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="commission-rate">Taxa de Comissão (%)</Label>
              <Input
                id="commission-rate"
                type="number"
                placeholder="15"
                defaultValue="15"
              />
            </div>
            <div>
              <Label htmlFor="cookie-duration">Duração do Cookie (dias)</Label>
              <Input
                id="cookie-duration"
                type="number"
                placeholder="30"
                defaultValue="30"
              />
            </div>
          </div>

          <Button>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {affiliates.reduce((acc, a) => acc + a.total_clicks, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de cliques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cadastros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {affiliates.reduce((acc, a) => acc + a.total_conversions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de conversão: {affiliates.length > 0 ? ((affiliates.reduce((acc, a) => acc + a.total_conversions, 0) / affiliates.reduce((acc, a) => acc + a.total_clicks, 0)) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(affiliates.reduce((acc, a) => acc + a.total_commission, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Novo Afiliado */}
      {showNewAffiliateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Afiliado</CardTitle>
            <CardDescription>
              Cadastre um novo parceiro afiliado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="affiliate-name">Nome</Label>
                  <Input
                    id="affiliate-name"
                    placeholder="Nome do afiliado"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="affiliate-email">Email</Label>
                  <Input
                    id="affiliate-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="referral-code">Código de Referência</Label>
                  <Input
                    id="referral-code"
                    placeholder="codigo123"
                    value={formData.referral_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, referral_code: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="commission-rate">Taxa de Comissão (%)</Label>
                  <Input
                    id="commission-rate"
                    type="number"
                    placeholder="15"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Criar Afiliado</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewAffiliateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Afiliados */}
      <Card>
        <CardHeader>
          <CardTitle>Afiliados Ativos</CardTitle>
          <CardDescription>
            Gerencie seus parceiros afiliados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {affiliates.map((affiliate) => (
              <div key={affiliate.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{affiliate.name}</h3>
                    {getStatusBadge(affiliate.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Email: {affiliate.email}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Cliques: {affiliate.total_clicks}</span>
                    <span>Conversões: {affiliate.total_conversions}</span>
                    <span>Comissão: {formatCurrency(affiliate.total_commission)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={`https://meusaas.com/ref/${affiliate.referral_code}`}
                      readOnly
                      className="text-xs"
                      size={30}
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCopy(`https://meusaas.com/ref/${affiliate.referral_code}`)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Relatório
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleAffiliateStatus(affiliate.id, affiliate.status)}
                  >
                    {affiliate.status === 'active' ? 'Pausar' : 'Ativar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(affiliate.id, affiliate.name)}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
            
            {affiliates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum afiliado cadastrado ainda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}