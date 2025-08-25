import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { usePublicBooking, type BookingData } from '@/hooks/usePublicBooking';
import { 
  Loader2, 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Calendar as CalendarIcon,
  Star,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PublicBooking() {
  const { publicLink } = useParams<{ publicLink: string }>();
  const { toast } = useToast();
  
  const {
    salonSettings,
    services,
    employees,
    loading,
    error,
    generateTimeSlots,
    createBooking
  } = usePublicBooking(publicLink || '');

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // Generate time slots when dependencies change
  useEffect(() => {
    if (selectedServices.length && selectedEmployee && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      generateTimeSlots(dateString, selectedServices, selectedEmployee)
        .then(setTimeSlots);
    }
  }, [selectedServices, selectedEmployee, selectedDate, generateTimeSlots]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
    // Reset time selection when services change
    setSelectedTime('');
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    // Reset time selection when employee changes
    setSelectedTime('');
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Reset time selection when date changes
    setSelectedTime('');
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
      if (match) {
        return [
          match[1] && `(${match[1]}`,
          match[2] && `) ${match[2]}`,
          match[3] && `-${match[3]}`
        ].filter(Boolean).join('');
      }
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setClientData(prev => ({ ...prev, phone: formatted }));
  };

  const canConfirmBooking = () => {
    return selectedServices.length > 0 && 
           selectedEmployee && 
           selectedDate && 
           selectedTime && 
           clientData.name && 
           clientData.phone;
  };

  const handleConfirmBooking = async () => {
    if (!canConfirmBooking() || !selectedDate) return;

    setIsCreatingBooking(true);
    
    try {
      const bookingData: BookingData = {
        clientName: clientData.name,
        clientPhone: clientData.phone,
        clientEmail: clientData.email,
        selectedServices,
        selectedEmployee,
        selectedDate: format(selectedDate, 'yyyy-MM-dd'),
        selectedTime
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        toast({
          title: "Agendamento realizado!",
          description: "Seu agendamento foi criado com sucesso. Você receberá uma confirmação em breve.",
        });
        
        // Reset form
        setSelectedServices([]);
        setSelectedEmployee('');
        setSelectedDate(undefined);
        setSelectedTime('');
        setClientData({ name: '', phone: '', email: '' });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no agendamento",
          description: "Não foi possível criar seu agendamento. Tente novamente.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no agendamento",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !salonSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">
              Salão não encontrado
            </h1>
            <p className="text-muted-foreground">
              O link de agendamento que você está tentando acessar não é válido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedServicesData = services.filter(s => selectedServices.includes(s.id));
  const totalPrice = selectedServicesData.reduce((acc, service) => acc + Number(service.price), 0);
  const totalDuration = selectedServicesData.reduce((acc, service) => acc + service.duration_minutes, 0);
  const selectedEmployeeData = employees.find(e => e.id === selectedEmployee);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header with Banner and Logo */}
        <div className="text-center mb-12">
          {salonSettings.banner_url && (
            <div className="mb-8 relative">
              <img
                src={salonSettings.banner_url}
                alt="Banner"
                className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          )}
          
          <div className="flex flex-col items-center mb-6">
            {salonSettings.logo_url && (
              <div className="mb-4">
                <img
                  src={salonSettings.logo_url}
                  alt="Logo"
                  className="w-20 h-20 rounded-full shadow-lg border-4 border-white/20"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              {salonSettings.name}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Agende seus serviços online
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Client Information - First Step */}
          <Card className="shadow-lg border-0 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-accent" />
                </div>
                Suas informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nome completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={clientData.name}
                    onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-background/50 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Telefone/WhatsApp *</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={clientData.phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    className="bg-background/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={clientData.email}
                  onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          {clientData.name && clientData.phone && (
            <Card className="shadow-lg border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-accent" />
                  </div>
                  Escolha seus serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card 
                      key={service.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        selectedServices.includes(service.id) && "ring-2 ring-accent bg-accent/5"
                      )}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{service.category}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duration_minutes}min
                              </span>
                              <span className="font-bold text-accent">
                                R$ {Number(service.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {selectedServices.includes(service.id) && (
                            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center ml-3">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employees Section */}
          {selectedServices.length > 0 && (
            <Card className="shadow-lg border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                  Selecione o profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {employees.map((employee) => (
                    <Card 
                      key={employee.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        selectedEmployee === employee.id && "ring-2 ring-accent bg-accent/5"
                      )}
                      onClick={() => handleEmployeeSelect(employee.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-accent/20 text-accent font-semibold">
                              {employee.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">Profissional</p>
                          </div>
                          {selectedEmployee === employee.id && (
                            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date and Time Section */}
          {selectedServices.length > 0 && selectedEmployee && (
            <Card className="shadow-lg border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-accent" />
                  </div>
                  Escolha data e horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <h3 className="font-semibold mb-4">Selecione a data:</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      locale={ptBR}
                      className="rounded-lg border bg-background/50 backdrop-blur-sm p-3 pointer-events-auto"
                    />
                  </div>
                  
                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h3 className="font-semibold mb-4">Horários disponíveis:</h3>
                      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={cn(
                              "transition-all duration-200",
                              selectedTime === slot.time && "bg-accent hover:bg-accent/90",
                              !slot.available && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                      {timeSlots.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Nenhum horário disponível para esta data
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary and Confirmation */}
          {canConfirmBooking() && (
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-center">Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Services Summary */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    Serviços
                  </h4>
                  <div className="space-y-2">
                    {selectedServicesData.map(service => (
                      <div key={service.id} className="flex justify-between items-center p-2 bg-accent/5 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.duration_minutes}min</p>
                        </div>
                        <span className="font-bold text-accent">R$ {Number(service.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Professional and Date/Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-accent" />
                      Profissional
                    </h4>
                    <div className="flex items-center gap-3 p-2 bg-accent/5 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent/20 text-accent text-xs">
                          {selectedEmployeeData?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{selectedEmployeeData?.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-accent" />
                      Data e Horário
                    </h4>
                    <div className="p-2 bg-accent/5 rounded-lg">
                      <p className="font-medium text-sm">
                        {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">às {selectedTime}</p>
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Duração total:</span>
                    <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-2xl text-accent">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Confirm Button */}
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!canConfirmBooking() || isCreatingBooking}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 text-lg"
                  size="lg"
                >
                  {isCreatingBooking ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Confirmando...
                    </>
                  ) : (
                    <>
                      Confirmar Agendamento
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}