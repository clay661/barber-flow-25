import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { SuperAuthProvider } from "./components/auth/SuperAuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ProtectedSuperRoute } from "./components/super-admin/ProtectedSuperRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { SuperAdminLayout } from "./components/super-admin/SuperAdminLayout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Agendamentos from "./pages/Agendamentos";
import Servicos from "./pages/Servicos";
import Financas from "./pages/Financas";
import Configuracoes from "./pages/Configuracoes";
import ConfiguracoesPerfil from "./pages/ConfiguracoesPerfil";
import NotificationSettings from "./pages/NotificationSettings";
import Login from "./pages/Login";
import PublicBooking from "./pages/PublicBooking";
import NotFound from "./pages/NotFound";
import Divulgacao from "./pages/Divulgacao";
import FinancasSubAdmin from "./pages/FinancasSubAdmin";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import SuperAdminEmpresas from "./pages/super-admin/SuperAdminEmpresas";
import SuperAdminAssinaturas from "./pages/super-admin/SuperAdminAssinaturas";

const queryClient = new QueryClient();

// Componente wrapper para as rotas regulares
function RegularRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="funcionarios" element={
            <ProtectedRoute adminOnly>
              <Funcionarios />
            </ProtectedRoute>
          } />
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="financas" element={
            <ProtectedRoute adminOnly>
              <Financas />
            </ProtectedRoute>
          } />
          <Route path="financas-subadmin" element={
            <ProtectedRoute subAdminOnly>
              <FinancasSubAdmin />
            </ProtectedRoute>
          } />
          <Route path="divulgacao" element={
            <ProtectedRoute adminOnly>
              <Divulgacao />
            </ProtectedRoute>
          } />
          <Route path="configuracoes" element={
            <ProtectedRoute adminOnly>
              <Configuracoes />
            </ProtectedRoute>
          } />
          <Route path="perfil" element={<ConfiguracoesPerfil />} />
          <Route path="notificacoes" element={
            <ProtectedRoute adminOnly>
              <NotificationSettings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

// Componente wrapper para as rotas do super admin
function SuperAdminRoutes() {
  return (
    <SuperAuthProvider>
      <Routes>
        <Route path="/super-admin" element={
          <ProtectedSuperRoute>
            <SuperAdminLayout />
          </ProtectedSuperRoute>
        }>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="empresas" element={<SuperAdminEmpresas />} />
          <Route path="assinaturas" element={<SuperAdminAssinaturas />} />
          <Route path="planos" element={<div>Planos e Cobrança</div>} />
          <Route path="financeiro" element={<div>Financeiro</div>} />
          <Route path="configuracoes" element={<div>Configurações do SaaS</div>} />
          <Route path="seguranca" element={<div>Segurança</div>} />
        </Route>
      </Routes>
    </SuperAuthProvider>
  );
}

// Componente wrapper para rotas públicas
function PublicRoutes() {
  return (
    <SuperAuthProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/agendamento/:publicLink" element={<PublicBooking />} />
        </Routes>
      </AuthProvider>
    </SuperAuthProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={
            <SuperAuthProvider>
              <AuthProvider>
                <Login />
              </AuthProvider>
            </SuperAuthProvider>
          } />
          <Route path="/agendamento/:publicLink" element={<PublicBooking />} />
          
          {/* Rotas do Super Admin */}
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          
          {/* Rotas regulares */}
          <Route path="/*" element={<RegularRoutes />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;