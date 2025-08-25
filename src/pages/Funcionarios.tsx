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
  Calendar as CalendarIcon,
  User,
  X,
  Check,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEmployees, Employee } from "@/hooks/useEmployees";
import { EmployeeCredentialsModal } from "@/components/forms/EmployeeCredentialsModal";

export default function Funcionarios() {
  const { employees, loading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [employeeCredentials, setEmployeeCredentials] = useState<{
    name: string;
    email: string;
    password: string;
    phone?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    telefone: "",
    role: "FUNCIONARIO" as "ADMIN" | "SUBADMIN" | "FUNCIONARIO" | "RECEPCIONISTA",
    status: "ativo" as "ativo" | "inativo"
  });

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.telefone && employee.telefone.includes(searchTerm)) ||
    (employee.pro_email && employee.pro_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        telefone: employee.telefone || "",
        role: employee.role,
        status: employee.status
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        telefone: "",
        role: "FUNCIONARIO",
        status: "ativo"
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: "",
      telefone: "",
      role: "FUNCIONARIO",
      status: "ativo"
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.telefone) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
        handleCloseDialog();
      } else {
        const result = await createEmployee(formData);
        handleCloseDialog();
        
        // Mostrar modal com credenciais geradas
        if (result?.credentials) {
          setEmployeeCredentials(result.credentials);
          setShowCredentialsModal(true);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deletingEmployee) {
      try {
        await deleteEmployee(deletingEmployee.id);
        setIsDeleteDialogOpen(false);
        setDeletingEmployee(null);
      } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
      }
    }
  };

  const openDeleteDialog = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      'ADMIN': 'Administrador',
      'SUBADMIN': 'Sub-administrador',
      'FUNCIONARIO': 'Funcionário',
      'RECEPCIONISTA': 'Recepcionista'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe de profissionais
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{employees.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">
              {employees.filter(f => f.status === 'ativo').length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-destructive">
              {employees.filter(f => f.status === 'inativo').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Funcionários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="p-4 sm:p-0 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, telefone, email ou função..."
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
                  <TableHead className="w-[120px] sm:w-auto">Telefone</TableHead>
                  <TableHead className="w-[150px] sm:w-auto hidden md:table-cell">E-mail</TableHead>
                  <TableHead className="w-[120px] sm:w-auto">Função</TableHead>
                  <TableHead className="w-[80px] sm:w-auto hidden sm:table-cell">Status</TableHead>
                  <TableHead className="w-[100px] sm:w-auto hidden lg:table-cell">Data Cadastro</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="font-medium text-sm">{employee.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {employee.telefone || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {employee.pro_email || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{getRoleDisplayName(employee.role)}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={employee.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                        {employee.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                        {new Date(employee.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9"
                          onClick={() => handleOpenDialog(employee)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9"
                          onClick={() => openDeleteDialog(employee)}
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
        </CardContent>
      </Card>

      {/* Dialog para Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as typeof formData.role }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SUBADMIN">Sub-administrador</SelectItem>
                  <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                  <SelectItem value="RECEPCIONISTA">Recepcionista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as typeof formData.status }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingEmployee && (
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                <strong>Nota:</strong> Email profissional e senha serão gerados automaticamente após o cadastro.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="hover-gold" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {!isSubmitting && <Check className="h-4 w-4 mr-2" />}
              {editingEmployee ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o funcionário <strong>{deletingEmployee?.name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Credenciais */}
      <EmployeeCredentialsModal
        open={showCredentialsModal}
        onOpenChange={setShowCredentialsModal}
        credentials={employeeCredentials}
      />
    </div>
  );
}
