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
  Clock,
  DollarSign,
  Scissors
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useServices, Service } from '@/hooks/useServices';
import { ServiceForm } from '@/components/forms/ServiceForm';
import { DeleteConfirmDialog } from '@/components/forms/DeleteConfirmDialog';

export default function Servicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  const { services, loading: servicesLoading, createService, updateService, deleteService } = useServices();

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateService = async (data: Omit<Service, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      await createService(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (data: Omit<Service, 'id' | 'created_at'>) => {
    if (!editingService) return;
    
    setLoading(true);
    try {
      await updateService(editingService.id, data);
      setEditingService(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    setLoading(true);
    try {
      await deleteService(serviceToDelete.id);
      setServiceToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setServiceFormOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const activeServices = services.filter(s => s.status === 'ativo');
  const averagePrice = activeServices.length > 0 
    ? Math.round(activeServices.reduce((sum, s) => sum + s.price, 0) / activeServices.length) 
    : 0;
  const totalRevenue = activeServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela empresa
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto"
          onClick={() => {
            setEditingService(null);
            setServiceFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Serviços Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{activeServices.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Preço Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">R$ {averagePrice}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mais Caro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              R$ {services.length > 0 ? Math.max(...services.map(s => s.price)) : 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Potencial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">R$ {totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="p-4 sm:p-0 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar serviços..."
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
                  <TableHead className="w-[150px] sm:w-auto">Serviço</TableHead>
                  <TableHead className="w-[100px] sm:w-auto hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Duração</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Preço</TableHead>
                  <TableHead className="w-[80px] sm:w-auto hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicesLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando serviços...
                    </TableCell>
                  </TableRow>
                ) : filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm ? 'Nenhum serviço encontrado com esse filtro.' : 'Nenhum serviço cadastrado ainda.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-accent" />
                          <span className="font-medium text-sm">{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{service.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{service.duration_minutes} min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium text-sm">R$ {service.price}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={service.status === 'ativo' ? "default" : "secondary"} className="text-xs">
                          {service.status === 'ativo' ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openEditForm(service)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9"
                            onClick={() => openDeleteDialog(service)}
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

      <ServiceForm
        open={serviceFormOpen}
        onOpenChange={setServiceFormOpen}
        service={editingService}
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        loading={loading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteService}
        title="Excluir Serviço"
        description={`Tem certeza que deseja excluir o serviço "${serviceToDelete?.name}"? Esta ação também removerá todos os agendamentos relacionados e não pode ser desfeita.`}
        loading={loading}
      />
    </div>
  );
}