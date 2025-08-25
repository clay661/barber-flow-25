import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
}

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployee: string;
  onSelectionChange: (employeeId: string) => void;
}

export function EmployeeSelector({ employees, selectedEmployee, onSelectionChange }: EmployeeSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Escolha o profissional que irá realizar seus serviços:
      </p>
      
      <div className="grid gap-3">
        {employees.map((employee) => (
          <Card 
            key={employee.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedEmployee === employee.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectionChange(employee.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{employee.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Profissional
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {employees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum profissional disponível no momento.</p>
        </div>
      )}
    </div>
  );
}