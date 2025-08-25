import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  Calendar as CalendarIcon
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClients, Client } from '@/hooks/useClients';
import { ClientForm } from '@/components/forms/ClientForm';
import { DeleteConfirmDialog } from '@/components/forms/DeleteConfirmDialog';

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const { clients, loading: clientsLoading, createClient, updateClient, deleteClient } = useClients();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.telefone && client.telefone.includes(searchTerm)) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateClient = async (data: Omit<Client, 'id' | 'created_at' | 'total_visits'>) => {
    setLoading(true);
    try {
      await createClient(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (data: Omit<Client, 'id' | 'created_at' | 'total_visits'>) => {
    if (!editingClient) return;
    
    setLoading(true);
    try {
      await updateClient(editingClient.id, data);
      setEditingClient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    setLoading(true);
    try {
      await deleteClient(clientToDelete.id);
      setClientToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (client: Client) => {
    setEditingClient(client);
    setClientFormOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const newClientsThisMonth = clients.filter(client => {
    const clientDate = new Date(client.created_at);
    const now = new Date();
    return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto"
          onClick={() => {
            setEditingClient(null);
            setClientFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{clients.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Novos este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">{newClientsThisMonth}</div>
          </CardContent>
        </Card>

        <Card className="hover-card sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">{clients.filter(c => c.status === 'ativo').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="p-4 sm:p-0 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] sm:w-auto">Nome</TableHead>
                  <TableHead className="w-[150px] sm:w-auto hidden md:table-cell">Contato</TableHead>
                  <TableHead className="w-[120px] sm:w-auto">Telefone</TableHead>
                  <TableHead className="w-[100px] sm:w-auto hidden lg:table-cell">Data Cadastro</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Visitas</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando clientes...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm ? 'Nenhum cliente encontrado com esse filtro.' : 'Nenhum cliente cadastrado ainda.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{client.name}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          {client.telefone && (
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {client.telefone}
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {client.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="md:hidden text-sm">{client.telefone || 'N/A'}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                          {new Date(client.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{client.total_visits} visitas</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openEditForm(client)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openDeleteDialog(client)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClientForm
        open={clientFormOpen}
        onOpenChange={setClientFormOpen}
        client={editingClient}
        onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
        loading={loading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteClient}
        title="Excluir Cliente"
        description={`Tem certeza que deseja excluir o cliente "${clientToDelete?.name}"? Esta ação também removerá todos os agendamentos relacionados e não pode ser desfeita.`}
        loading={loading}
      />
    </div>
  );
}