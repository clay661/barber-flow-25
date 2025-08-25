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
  Check
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Funcionario {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  createdAt: string;
}

// Dados mockados
const initialFuncionarios: Funcionario[] = [
  {
    id: 1,
    name: "Maria Silva",
    phone: "(11) 99999-9999",
    email: "maria@barbershop.com",
    role: "Cabeleireira",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "João Santos",
    phone: "(11) 88888-8888", 
    email: "joao@barbershop.com",
    role: "Barbeiro",
    createdAt: "2024-02-20"
  },
  {
    id: 3,
    name: "Ana Costa",
    phone: "(11) 77777-7777",
    email: "ana@barbershop.com", 
    role: "Manicure",
    createdAt: "2024-03-10"
  }
];

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [deletingFuncionario, setDeletingFuncionario] = useState<Funcionario | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: ""
  });

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.phone.includes(searchTerm) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (funcionario?: Funcionario) => {
    if (funcionario) {
      setEditingFuncionario(funcionario);
      setFormData({
        name: funcionario.name,
        phone: funcionario.phone,
        email: funcionario.email,
        role: funcionario.role
      });
    } else {
      setEditingFuncionario(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        role: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFuncionario(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      role: ""
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.role) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingFuncionario) {
      // Editar funcionário existente
      setFuncionarios(prev => 
        prev.map(func => 
          func.id === editingFuncionario.id 
            ? { ...func, ...formData }
            : func
        )
      );
      toast({
        title: "Sucesso",
        description: "Funcionário atualizado com sucesso!",
      });
    } else {
      // Adicionar novo funcionário
      const newFuncionario: Funcionario = {
        id: Math.max(...funcionarios.map(f => f.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setFuncionarios(prev => [...prev, newFuncionario]);
      toast({
        title: "Sucesso",
        description: "Funcionário cadastrado com sucesso!",
      });
    }

    handleCloseDialog();
  };

  const handleDelete = () => {
    if (deletingFuncionario) {
      setFuncionarios(prev => prev.filter(func => func.id !== deletingFuncionario.id));
      toast({
        title: "Sucesso",
        description: "Funcionário removido com sucesso!",
      });
      setIsDeleteDialogOpen(false);
      setDeletingFuncionario(null);
    }
  };

  const openDeleteDialog = (funcionario: Funcionario) => {
    setDeletingFuncionario(funcionario);
    setIsDeleteDialogOpen(true);
  };

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
            <div className="text-xl md:text-2xl font-bold text-foreground">{funcionarios.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Barbeiros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-success">
              {funcionarios.filter(f => f.role.toLowerCase().includes('barbeiro')).length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cabeleireiras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">
              {funcionarios.filter(f => f.role.toLowerCase().includes('cabeleireira')).length}
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
                  <TableHead className="w-[100px] sm:w-auto hidden lg:table-cell">Data Cadastro</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="font-medium text-sm">{funcionario.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {funcionario.phone}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {funcionario.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{funcionario.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                        {new Date(funcionario.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover-glow h-8 w-8 p-0 sm:h-9 sm:w-9"
                          onClick={() => handleOpenDialog(funcionario)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover-darken h-8 w-8 p-0 sm:h-9 sm:w-9"
                          onClick={() => openDeleteDialog(funcionario)}
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
              {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
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
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Ex: Barbeiro, Cabeleireira, Manicure"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="hover-gold">
              <Check className="h-4 w-4 mr-2" />
              {editingFuncionario ? 'Atualizar' : 'Cadastrar'}
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
              Tem certeza que deseja excluir o funcionário <strong>{deletingFuncionario?.name}</strong>? 
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
    </div>
  );
}