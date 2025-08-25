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

// Dados mockados
const mockClients = [
  {
    id: 1,
    name: "João Silva",
    phone: "(11) 99999-9999",
    email: "joao@email.com",
    createdAt: "2024-01-15",
    totalVisits: 12
  },
  {
    id: 2,
    name: "Pedro Santos",
    phone: "(11) 88888-8888", 
    email: "pedro@email.com",
    createdAt: "2024-02-20",
    totalVisits: 8
  },
  {
    id: 3,
    name: "Lucas Costa",
    phone: "(11) 77777-7777",
    email: "lucas@email.com", 
    createdAt: "2024-03-10",
    totalVisits: 5
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    phone: "(11) 66666-6666",
    email: "carlos@email.com",
    createdAt: "2024-03-25", 
    totalVisits: 3
  }
];

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 hover-gold w-full sm:w-auto">
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
            <div className="text-xl md:text-2xl font-bold text-foreground">{mockClients.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Novos este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">2</div>
          </CardContent>
        </Card>

        <Card className="hover-card sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">{mockClients.length}</div>
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
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{client.name}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {client.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {client.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="md:hidden text-sm">{client.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{client.totalVisits} visitas</Badge>
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