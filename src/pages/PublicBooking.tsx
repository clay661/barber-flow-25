import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicLayout } from '@/components/public/PublicLayout';
import { ServiceSelector } from '@/components/public/ServiceSelector';
import { EmployeeSelector } from '@/components/public/EmployeeSelector';
import { TimeSlotSelector } from '@/components/public/TimeSlotSelector';
import { ClientForm } from '@/components/public/ClientForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePublicBooking, type BookingData } from '@/hooks/usePublicBooking';
import { Loader2, Calendar, Clock, User, Scissors } from 'lucide-react';

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

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  const steps = [
    { number: 1, title: 'Serviços', icon: Scissors },
    { number: 2, title: 'Profissional', icon: User },
    { number: 3, title: 'Data e Hora', icon: Calendar },
    { number: 4, title: 'Seus Dados', icon: User }
  ];

  // Generate time slots when services, employee, or date change
  useEffect(() => {
    if (selectedServices.length && selectedEmployee && selectedDate) {
      generateTimeSlots(selectedDate, selectedServices, selectedEmployee)
        .then(setTimeSlots);
    }
  }, [selectedServices, selectedEmployee, selectedDate, generateTimeSlots]);

  const handleNext = () => {
    if (canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedServices.length > 0;
      case 2: return selectedEmployee !== '';
      case 3: return selectedDate !== '' && selectedTime !== '';
      case 4: return clientData.name && clientData.phone; // Email é opcional
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNext()) return;

    setIsCreatingBooking(true);
    
    try {
      const bookingData: BookingData = {
        clientName: clientData.name,
        clientPhone: clientData.phone,
        clientEmail: clientData.email,
        selectedServices,
        selectedEmployee,
        selectedDate,
        selectedTime
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        toast({
          title: "Agendamento realizado!",
          description: "Seu agendamento foi criado com sucesso. Você receberá uma confirmação em breve.",
        });
        
        // Reset form
        setCurrentStep(1);
        setSelectedServices([]);
        setSelectedEmployee('');
        setSelectedDate('');
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
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !salonSettings) {
    return (
      <PublicLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Salão não encontrado
          </h1>
          <p className="text-muted-foreground">
            O link de agendamento que você está tentando acessar não é válido.
          </p>
        </div>
      </PublicLayout>
    );
  }

  const selectedServicesData = services.filter(s => selectedServices.includes(s.id));
  const totalPrice = selectedServicesData.reduce((acc, service) => acc + Number(service.price), 0);
  const totalDuration = selectedServicesData.reduce((acc, service) => acc + service.duration_minutes, 0);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {salonSettings.banner_url && (
            <div className="mb-6">
              <img
                src={salonSettings.banner_url}
                alt="Banner do salão"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 mb-4">
            {salonSettings.logo_url && (
              <img
                src={salonSettings.logo_url}
                alt="Logo do salão"
                className="w-16 h-16 rounded-lg"
              />
            )}
            <h1 className="text-3xl font-bold">{salonSettings.name}</h1>
          </div>
          
          <p className="text-muted-foreground text-lg">
            Agende seus serviços de forma rápida e fácil
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <ServiceSelector
                services={services}
                selectedServices={selectedServices}
                onSelectionChange={setSelectedServices}
              />
            )}

            {currentStep === 2 && (
              <EmployeeSelector
                employees={employees}
                selectedEmployee={selectedEmployee}
                onSelectionChange={setSelectedEmployee}
              />
            )}

            {currentStep === 3 && (
              <TimeSlotSelector
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                timeSlots={timeSlots}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
              />
            )}

            {currentStep === 4 && (
              <ClientForm
                clientData={clientData}
                onDataChange={setClientData}
              />
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedServices.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Serviços selecionados:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {selectedServicesData.map(service => (
                      <li key={service.id}>
                        {service.name} - R$ {Number(service.price).toFixed(2)} ({service.duration_minutes}min)
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedEmployee && (
                  <div>
                    <h4 className="font-medium">Profissional:</h4>
                    <p className="text-sm text-muted-foreground">
                      {employees.find(e => e.id === selectedEmployee)?.name}
                    </p>
                  </div>
                )}
                
                {selectedDate && selectedTime && (
                  <div>
                    <h4 className="font-medium">Data e horário:</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}
                    </p>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <div className="text-right">
                      <div className="font-bold text-lg">R$ {totalPrice.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Voltar
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext()}
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || isCreatingBooking}
            >
              {isCreatingBooking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Agendando...
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </Button>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}