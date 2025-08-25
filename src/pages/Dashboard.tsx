import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";
import { ReceptionistDashboard } from "@/components/dashboard/ReceptionistDashboard";

export default function Dashboard() {
  const { employee } = useAuth();

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Renderizar dashboard baseado no role
  if (employee.role === 'ADMIN' || employee.role === 'SUBADMIN') {
    return <AdminDashboard />;
  }

  if (employee.role === 'FUNCIONARIO') {
    return <EmployeeDashboard />;
  }

  if (employee.role === 'RECEPCIONISTA') {
    return <ReceptionistDashboard />;
  }

  // Fallback para admin dashboard
  return <AdminDashboard />;
}