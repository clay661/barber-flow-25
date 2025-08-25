import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  User,
  Clock,
  Settings,
  Save
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// Dados mockados
const mockBarbers = [
  { id: 1, name: "Carlos Silva", active: true, specialty: "Corte + Barba" },
  { id: 2, name: "Miguel Santos", active: true, specialty: "Corte Clássico" },
  { id: 3, name: "João Costa", active: false, specialty: "Barba Especializada" },
];

const mockWorkingHours = {
  monday: { start: "08:00", end: "18:00", active: true },
  tuesday: { start: "08:00", end: "18:00", active: true },
  wednesday: { start: "08:00", end: "18:00", active: true },
  thursday: { start: "08:00", end: "18:00", active: true },
  friday: { start: "08:00", end: "18:00", active: true },
  saturday: { start: "08:00", end: "16:00", active: true },
  sunday: { start: "10:00", end: "14:00", active: false },
};

const dayNames = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira", 
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function Configuracoes() {
  const [workingHours, setWorkingHours] = useState(mockWorkingHours);

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie barbeiros e horários de funcionamento
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barbeiros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                Barbeiros
              </CardTitle>
              <Button size="sm" className="bg-primary hover:bg-primary/90 hover-gold">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBarbers.map((barber) => (
                <div key={barber.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{barber.name}</h4>
                      <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={barber.active ? "default" : "secondary"}>
                      {barber.active ? "Ativo" : "Inativo"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="hover-glow">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover-darken">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horários de Funcionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(workingHours).map(([day, hours]) => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {dayNames[day as keyof typeof dayNames]}
                    </Label>
                    <Switch
                      checked={hours.active}
                      onCheckedChange={(checked) => updateWorkingHours(day, 'active', checked)}
                    />
                  </div>
                  {hours.active && (
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Abertura</Label>
                        <Input
                          type="time"
                          value={hours.start}
                          onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Fechamento</Label>
                        <Input
                          type="time"
                          value={hours.end}
                          onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                  <Separator />
                </div>
              ))}
              <Button className="w-full mt-4 hover-gold">
                <Save className="h-4 w-4 mr-2" />
                Salvar Horários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="barbershop-name">Nome da Barbearia</Label>
                <Input id="barbershop-name" placeholder="Nexio Premium" />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Rua das Flores, 123" />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="interval">Intervalo entre Agendamentos (min)</Label>
                <Input id="interval" type="number" placeholder="15" />
              </div>
              <div>
                <Label htmlFor="advance-booking">Antecedência Máxima (dias)</Label>
                <Input id="advance-booking" type="number" placeholder="30" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificações por WhatsApp</Label>
                <Switch id="notifications" />
              </div>
            </div>
          </div>
          <Button className="mt-6 hover-gold">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}