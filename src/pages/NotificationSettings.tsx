import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNotifications, NotificationSettings as NotificationSettingsType } from '@/hooks/useNotifications';
import { NotificationSettingsForm } from '@/components/forms/NotificationSettingsForm';
import { NotificationHistory } from '@/components/notifications/NotificationHistory';
import { DeleteConfirmDialog } from '@/components/forms/DeleteConfirmDialog';
import { 
  Plus, 
  Settings, 
  Edit, 
  Trash2, 
  MessageSquare,
  Smartphone,
  MessageCircle
} from 'lucide-react';

export default function NotificationSettings() {
  const [settingsFormOpen, setSettingsFormOpen] = useState(false);
  const [editingSettings, setEditingSettings] = useState<NotificationSettingsType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [settingsToDelete, setSettingsToDelete] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(false);

  const { 
    settings, 
    history, 
    loading: dataLoading, 
    createSettings, 
    updateSettings, 
    deleteSettings
  } = useNotifications();

  const handleCreateSettings = async (data: Omit<NotificationSettingsType, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      await createSettings(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (data: Omit<NotificationSettingsType, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingSettings) return;
    
    setLoading(true);
    try {
      await updateSettings(editingSettings.id, data);
      setEditingSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSettings = async () => {
    if (!settingsToDelete) return;
    
    setLoading(true);
    try {
      await deleteSettings(settingsToDelete.id);
      setSettingsToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (settings: NotificationSettingsType) => {
    setLoading(true);
    try {
      await updateSettings(settings.id, { is_active: !settings.is_active });
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (settings: NotificationSettingsType) => {
    setEditingSettings(settings);
    setSettingsFormOpen(true);
  };

  const openDeleteDialog = (settings: NotificationSettingsType) => {
    setSettingsToDelete(settings);
    setDeleteDialogOpen(true);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'twilio':
        return <Smartphone className="h-4 w-4" />;
      case 'ultramsg':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'twilio':
        return 'Twilio (SMS)';
      case 'ultramsg':
        return 'UltraMsg (WhatsApp)';
      default:
        return provider;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações de Notificação</h1>
          <p className="text-muted-foreground">
            Configure o envio automático de SMS e WhatsApp para clientes
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => {
            setEditingSettings(null);
            setSettingsFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Configuração
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              {settings.filter(s => s.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notificações Enviadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">
              {history.length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">
              {history.filter(h => h.status === 'sent' || h.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de API</CardTitle>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
            <div className="text-center py-8">Carregando configurações...</div>
          ) : settings.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Nenhuma configuração encontrada.</p>
              <Button onClick={() => setSettingsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Configuração
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provedor</TableHead>
                    <TableHead className="hidden md:table-cell">Identificador</TableHead>
                    <TableHead className="hidden lg:table-cell">Número</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getProviderIcon(setting.provider)}
                          <span className="font-medium text-sm">
                            {getProviderName(setting.provider)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {setting.api_key_sid.substring(0, 8)}...
                        </code>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {setting.phone_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={setting.is_active}
                            onCheckedChange={() => handleToggleActive(setting)}
                            disabled={loading}
                          />
                          <Badge variant={setting.is_active ? "default" : "secondary"} className="text-xs">
                            {setting.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openEditForm(setting)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openDeleteDialog(setting)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Notificações */}
      <NotificationHistory history={history} loading={dataLoading} />

      {/* Formulário de Configurações */}
      <NotificationSettingsForm
        open={settingsFormOpen}
        onOpenChange={setSettingsFormOpen}
        settings={editingSettings}
        onSubmit={editingSettings ? handleUpdateSettings : handleCreateSettings}
        loading={loading}
      />

      {/* Diálogo de Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteSettings}
        title="Excluir Configuração"
        description={`Tem certeza que deseja excluir a configuração "${settingsToDelete ? getProviderName(settingsToDelete.provider) : ''}"? Esta ação não pode ser desfeita.`}
        loading={loading}
      />
    </div>
  );
}