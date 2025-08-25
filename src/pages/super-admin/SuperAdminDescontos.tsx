import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Edit, Trash2, Percent, DollarSign } from "lucide-react";
import { useDiscountCoupons } from "@/hooks/useSuperAdminData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminDescontos() {
  const { coupons, loading, createCoupon, updateCoupon, deleteCoupon } = useDiscountCoupons();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    usage_limit: '',
    start_date: '',
    end_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.value) {
      toast({
        title: "Erro",
        description: "Código e valor são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCoupon({
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: 'active'
      });
      
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        usage_limit: '',
        start_date: '',
        end_date: ''
      });
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copiado!",
      description: "Código do cupom copiado para a área de transferência",
    });
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Tem certeza que deseja excluir o cupom ${code}?`)) {
      await deleteCoupon(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
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
          <h1 className="text-3xl font-bold text-foreground">Cupons de Desconto</h1>
          <p className="text-muted-foreground mt-2">
            Crie e gerencie cupons de desconto para seus clientes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cupom
        </Button>
      </div>

      {/* Formulário de Criação */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Cupom</CardTitle>
          <CardDescription>
            Configure os detalhes do seu cupom de desconto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="coupon-code">Código do Cupom</Label>
                <Input
                  id="coupon-code"
                  placeholder="Ex: DESCONTO20"
                  className="uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coupon-type">Tipo de Desconto</Label>
                <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentual (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="discount-value">Valor do Desconto</Label>
                <Input
                  id="discount-value"
                  type="number"
                  placeholder="20"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="usage-limit">Limite de Uso</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  placeholder="100"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="start-date">Data de Início</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">Data de Expiração</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit">Criar Cupom</Button>
          </form>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cupons Ativos</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {coupons.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {coupons.filter(c => c.status === 'expired').length} cupons expirados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usos Este Mês</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.reduce((acc, c) => acc + c.used_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de usos dos cupons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desconto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(coupons.reduce((acc, c) => acc + (c.used_count * c.value), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total descontado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cupons */}
      <Card>
        <CardHeader>
          <CardTitle>Cupons Cadastrados</CardTitle>
          <CardDescription>
            Gerencie todos os seus cupons de desconto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{coupon.code}</h3>
                    {getStatusBadge(coupon.status)}
                    <Badge variant="outline">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatCurrency(coupon.value)} OFF`}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <span>Usado: {coupon.used_count}/{coupon.usage_limit || '∞'}</span>
                    <span>Criado: {formatDate(coupon.created_at)}</span>
                    <span>
                      {coupon.end_date ? 
                        (new Date(coupon.end_date) < new Date() ? 'Expirou' : 'Expira'): 'Sem data'}: {formatDate(coupon.end_date)}
                    </span>
                    <span>Economia: {formatCurrency(coupon.used_count * coupon.value)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(coupon.code)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateCoupon(coupon.id, { 
                      status: coupon.status === 'active' ? 'paused' : 'active' 
                    })}
                    disabled={coupon.status === 'expired'}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {coupon.status === 'active' ? 'Pausar' : 'Ativar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(coupon.id, coupon.code)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
            
            {coupons.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum cupom cadastrado ainda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}