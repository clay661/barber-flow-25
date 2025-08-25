import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  category: string;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: string[];
  onSelectionChange: (selectedServices: string[]) => void;
}

export function ServiceSelector({ services, selectedServices, onSelectionChange }: ServiceSelectorProps) {
  const handleServiceToggle = (serviceId: string) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onSelectionChange(newSelection);
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Selecione os serviços que deseja agendar:
      </p>
      
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category}>
          <h3 className="font-semibold text-lg mb-3">{category}</h3>
          <div className="grid gap-3">
            {categoryServices.map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedServices.includes(service.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">
                              {service.duration_minutes}min
                            </Badge>
                            <span className="text-lg font-semibold text-primary">
                              R$ {Number(service.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      {services.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum serviço disponível no momento.</p>
        </div>
      )}
    </div>
  );
}