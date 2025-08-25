import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Agendamentos from "./pages/Agendamentos";
import Servicos from "./pages/Servicos";
import Financas from "./pages/Financas";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import PublicBooking from "./pages/PublicBooking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/agendamento/:publicLink" element={<PublicBooking />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="funcionarios" element={<Funcionarios />} />
              <Route path="agendamentos" element={<Agendamentos />} />
              <Route path="servicos" element={<Servicos />} />
              <Route path="financas" element={<Financas />} />
              <Route path="configuracoes" element={
                <ProtectedRoute adminOnly>
                  <Configuracoes />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
