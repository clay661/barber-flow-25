import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Upload, 
  Settings,
  Save,
  Clock,
  Image,
  X
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const { toast } = useToast();

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (type: 'logo' | 'banner', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'logo') {
          setLogo(result);
        } else {
          setBanner(result);
        }
        toast({
          title: "Sucesso",
          description: `${type === 'logo' ? 'Logo' : 'Banner'} carregado com sucesso!`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogo(null);
    } else {
      setBanner(null);
    }
    toast({
      title: "Sucesso",
      description: `${type === 'logo' ? 'Logo' : 'Banner'} removido com sucesso!`,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie configurações gerais, horários e imagens do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Upload de Imagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-accent" />
              Imagens do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Logo da Barbearia</Label>
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                {logo ? (
                  <div className="relative">
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('logo', e)}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Button variant="outline" className="hover-glow" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {logo ? 'Alterar Logo' : 'Carregar Logo'}
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG até 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Banner Principal</Label>
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                {banner ? (
                  <div className="relative">
                    <img 
                      src={banner} 
                      alt="Banner" 
                      className="w-full max-w-sm h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage('banner')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-sm h-32 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('banner', e)}
                    className="hidden"
                    id="banner-upload"
                  />
                  <Label htmlFor="banner-upload" className="cursor-pointer">
                    <Button variant="outline" className="hover-glow" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {banner ? 'Alterar Banner' : 'Carregar Banner'}
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG até 5MB
                  </p>
                </div>
              </div>
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
                <Label htmlFor="notifications">Notificações Automáticas</Label>
                <Switch id="notifications" />
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/notificacoes'}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar SMS/WhatsApp
                </Button>
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