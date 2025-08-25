import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Key } from "lucide-react";
import { useTenantsManagement } from "@/hooks/useTenantsManagement";
import { TenantFormModal } from "@/components/super-admin/TenantFormModal";
import { useState } from "react";

export default function SuperAdminEmpresas() {
  const {
    tenants,
    loading,
    searchTerm,
    setSearchTerm,
    createTenant,
    updateTenant,
    toggleTenantStatus,
    deleteTenant,
    resetTenantPassword,
    getStatusBadge,
    formatDate
  } = useTenantsManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  const handleCreateTenant = async (data) => {
    await createTenant(data);
  };

  const handleUpdateTenant = async (data) => {
    if (editingTenant) {
      await updateTenant(editingTenant.id, data);
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleDelete = async (tenant) => {
    if (confirm(`Tem certeza que deseja excluir a empresa "${tenant.name}"?`)) {
      await deleteTenant(tenant.id);
    }
  };

  const handleResetPassword = async (tenant) => {
    if (confirm(`Tem certeza que deseja resetar a senha de "${tenant.name}"?`)) {
      await resetTenantPassword(tenant.id, tenant.name);
    }
  };

  const handleToggleStatus = async (tenant) => {
    await toggleTenantStatus(tenant.id, tenant.status);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Empresas</h1>
          <p className="text-muted-foreground mt-2">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Empresas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todas as empresas cadastradas no sistema
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Barra de pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar empresas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Total: {tenants.length} empresas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.length > 0 ? (
              tenants.map((tenant) => {
                const statusBadge = getStatusBadge(tenant.status);
                return (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{tenant.name}</h3>
                        <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email: {tenant.email}
                      </p>
                      {tenant.document_number && (
                        <p className="text-sm text-muted-foreground mb-1">
                          {tenant.document_type?.toUpperCase()}: {tenant.document_number}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Cadastrada em: {formatDate(tenant.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(tenant)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResetPassword(tenant)}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        Resetar Senha
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(tenant)}
                        className={tenant.status === 'active' ? 'text-yellow-600' : 'text-green-600'}
                      >
                        {tenant.status === 'active' ? 'Suspender' : 'Ativar'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(tenant)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'Nenhuma empresa encontrada com esse termo.' : 'Nenhuma empresa cadastrada ainda.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TenantFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingTenant ? handleUpdateTenant : handleCreateTenant}
        tenant={editingTenant}
        title={editingTenant ? "Editar Empresa" : "Nova Empresa"}
        description={editingTenant ? "Edite as informações da empresa." : "Cadastre uma nova empresa no sistema."}
      />
    </div>
  );
}