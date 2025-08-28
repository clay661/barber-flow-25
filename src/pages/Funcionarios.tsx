
import { useState } from 'react';
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { EmployeeCredentialsModal } from '@/components/forms/EmployeeCredentialsModal';
import { DeleteConfirmDialog } from '@/components/forms/DeleteConfirmDialog';

export default function Funcionarios() {
  const { employees, loading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [employeeCredentials, setEmployeeCredentials] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.custom_role_name && employee.custom_role_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateEmployee = async (data: any) => {
    try {
      setFormLoading(true);
      const result = await createEmployee(data);
      
      // Mostrar credenciais se criação foi bem-sucedida
      if (result && result.credentials) {
        setEmployeeCredentials(result.credentials);
        setIsCredentialsModalOpen(true);
      }
    } catch (error) {
      // Erro já é tratado no hook
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEmployee = async (data: any) => {
    if (!selectedEmployee) return;
    
    try {
      setFormLoading(true);
      await updateEmployee(selectedEmployee.id, data);
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (isEditing) {
      await handleUpdateEmployee(data);
    } else {
      await handleCreateEmployee(data);
    }
  };

  const openCreateForm = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (employee: any) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (employeeToDelete) {
      await deleteEmployee(employeeToDelete.id);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const getRoleDisplay = (employee: any) => {
    if (employee.role === 'OUTRO' && employee.custom_role_name) {
      return employee.custom_role_name;
    }
    
    const roleNames = {
      ADMIN: 'Administrador',
      SUBADMIN: 'Sub-administrador',
      FUNCIONARIO: 'Funcionário',
      RECEPCIONISTA: 'Recepcionista',
      OUTRO: 'Outro'
    };
    
    return roleNames[employee.role] || employee.role;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'SUBADMIN':
        return 'secondary';
      case 'FUNCIONARIO':
        return 'default';
      case 'RECEPCIONISTA':
        return 'outline';
      case 'OUTRO':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários do seu salão
          </p>
        </div>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  {employee.name}
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(employee.role)}>
                    {getRoleDisplay(employee)}
                  </Badge>
                </TableCell>
                <TableCell>{employee.telefone || 'Não informado'}</TableCell>
                <TableCell>
                  {employee.commission_type === 'percentage' 
                    ? `${employee.commission_value}%` 
                    : `R$ ${employee.commission_value.toFixed(2)}`
                  }
                </TableCell>
                <TableCell>
                  <Badge variant={employee.status === 'ativo' ? 'default' : 'secondary'}>
                    {employee.status === 'ativo' ? (
                      <><UserCheck className="h-3 w-3 mr-1" /> Ativo</>
                    ) : (
                      <><UserX className="h-3 w-3 mr-1" /> Inativo</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditForm(employee)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(employee)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EmployeeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        employee={selectedEmployee}
        loading={formLoading}
      />

      <EmployeeCredentialsModal
        open={isCredentialsModalOpen}
        onOpenChange={setIsCredentialsModalOpen}
        credentials={employeeCredentials}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Funcionário"
        description={`Tem certeza que deseja excluir o funcionário "${employeeToDelete?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
