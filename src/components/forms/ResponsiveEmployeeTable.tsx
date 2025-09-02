
import React from 'react';
import { Pencil, Trash2, UserCheck, UserX, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/hooks/useEmployees';

interface ResponsiveEmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  getRoleDisplay: (employee: Employee) => string;
  getRoleBadgeVariant: (role: string) => "default" | "secondary" | "destructive" | "outline";
}

export function ResponsiveEmployeeTable({ 
  employees, 
  onEdit, 
  onDelete, 
  getRoleDisplay, 
  getRoleBadgeVariant 
}: ResponsiveEmployeeTableProps) {
  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block border rounded-lg">
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
            {employees.map((employee) => (
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
                      onClick={() => onEdit(employee)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(employee)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{employee.name}</CardTitle>
                  <Badge variant={getRoleBadgeVariant(employee.role)} className="mt-1">
                    {getRoleDisplay(employee)}
                  </Badge>
                </div>
                <Badge variant={employee.status === 'ativo' ? 'default' : 'secondary'}>
                  {employee.status === 'ativo' ? (
                    <><UserCheck className="h-3 w-3 mr-1" /> Ativo</>
                  ) : (
                    <><UserX className="h-3 w-3 mr-1" /> Inativo</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.telefone || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Comissão: {employee.commission_type === 'percentage' 
                      ? `${employee.commission_value}%` 
                      : `R$ ${employee.commission_value.toFixed(2)}`
                    }
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(employee)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum funcionário cadastrado</p>
        </div>
      )}
    </>
  );
}
