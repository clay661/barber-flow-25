
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalonSettingsForm } from "@/components/forms/SalonSettingsForm";
import { WorkingHoursForm } from "@/components/forms/WorkingHoursForm";
import { SchedulingIntervalForm } from "@/components/forms/SchedulingIntervalForm";
import NotificationSettings from "./NotificationSettings";

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configure as opções do seu estabelecimento
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
          <TabsTrigger value="scheduling">Agendamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <SalonSettingsForm />
        </TabsContent>
        
        <TabsContent value="hours" className="space-y-6">
          <WorkingHoursForm />
        </TabsContent>
        
        <TabsContent value="scheduling" className="space-y-6">
          <SchedulingIntervalForm />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
