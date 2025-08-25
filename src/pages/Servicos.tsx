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

// Dados mockados
const mockServices = [
  {
    id: 1,
    name: "Corte Simples",
    price: 25,
    duration: 30,
    category: "Corte",
    active: true
  },
  {
    id: 2,
    name: "Corte + Barba",
    price: 45,
    duration: 60,
    category: "Combo", 
    active: true
  },
  {
    id: 3,
    name: "Barba Simples",
    price: 20,
    duration: 20,
    category: "Barba",
    active: true
  },
  {
    id: 4,
    name: "Corte Degradê",
    price: 35,
    duration: 45,
    category: "Corte",
    active: true
  },
  {
    id: 5,
    name: "Barba Completa",
    price: 30,
    duration: 30,
    category: "Barba",
    active: true
  },
  {
    id: 6,
    name: "Sobrancelha",
    price: 15,
    duration: 15,
    category: "Extras",
    active: false
  }
];

export default function Servicos() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeServices = mockServices.filter(s => s.active).length;
  const averagePrice = Math.round(mockServices.filter(s => s.active).reduce((sum, s) => sum + s.price, 0) / activeServices);
  const totalRevenue = mockServices.filter(s => s.active).reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela barbearia
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto">
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
            <div className="text-xl md:text-2xl font-bold text-foreground">{activeServices}</div>
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
            <div className="text-xl md:text-2xl font-bold text-success">
              R$ {Math.max(...mockServices.map(s => s.price))}
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
                {filteredServices.map((service) => (
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
                        <span className="text-sm">{service.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-medium text-sm">R$ {service.price}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={service.active ? "default" : "secondary"} className="text-xs">
                        {service.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9">
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9">
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
    </div>
  );
}