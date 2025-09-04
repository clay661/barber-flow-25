import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
import SuperAdminPlanos from "./pages/super-admin/SuperAdminPlanos";
import SuperAdminFinanceiro from "./pages/super-admin/SuperAdminFinanceiro";
import SuperAdminAfiliados from "./pages/super-admin/SuperAdminAfiliados";
import SuperAdminDescontos from "./pages/super-admin/SuperAdminDescontos";
import SuperAdminConfiguracoes from "./pages/super-admin/SuperAdminConfiguracoes";
import SuperAdminSeguranca from "./pages/super-admin/SuperAdminSeguranca";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SuperAuthProvider>
          <AuthProvider>
            <Routes>
              {/* Login público */}
              <Route path="/login" element={<Login />} />
              <Route path="/agendamento/:publicLink" element={<PublicBooking />} />
              
              {/* Super Admin routes */}
              <Route path="/super-admin" element={
                <ProtectedSuperRoute>
                  <SuperAdminLayout />
                </ProtectedSuperRoute>
              }>
                <Route index element={<SuperAdminDashboard />} />
                <Route path="empresas" element={<SuperAdminEmpresas />} />
                <Route path="assinaturas" element={<SuperAdminAssinaturas />} />
                <Route path="planos" element={<SuperAdminPlanos />} />
                <Route path="financeiro" element={<SuperAdminFinanceiro />} />
                <Route path="afiliados" element={<SuperAdminAfiliados />} />
                <Route path="descontos" element={<SuperAdminDescontos />} />
                <Route path="configuracoes" element={<SuperAdminConfiguracoes />} />
                <Route path="seguranca" element={<SuperAdminSeguranca />} />
              </Route>
              
              {/* Regular user routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Outlet />
                  </AppLayout>
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
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </SuperAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;