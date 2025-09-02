
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { EmployeeCredentialsModal } from '@/components/forms/EmployeeCredentialsModal';
import { DeleteConfirmDialog } from '@/components/forms/DeleteConfirmDialog';
import { ResponsiveEmployeeTable } from '@/components/forms/ResponsiveEmployeeTable';

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
      
      if (result && result.credentials) {
        setEmployeeCredentials(result.credentials);
        setIsCredentialsModalOpen(true);
      }
    } catch (error) {
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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários do seu salão
          </p>
        </div>
        <Button onClick={openCreateForm} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="w-full">
        <Input
          placeholder="Buscar funcionários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>

      <ResponsiveEmployeeTable
        employees={filteredEmployees}
        onEdit={openEditForm}
        onDelete={openDeleteDialog}
        getRoleDisplay={getRoleDisplay}
        getRoleBadgeVariant={getRoleBadgeVariant}
      />

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
