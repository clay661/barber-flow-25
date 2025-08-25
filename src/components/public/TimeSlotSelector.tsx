import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedTime: string;
  timeSlots: TimeSlot[];
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function TimeSlotSelector({ 
  selectedDate, 
  selectedTime, 
  timeSlots, 
  onDateChange, 
  onTimeChange 
}: TimeSlotSelectorProps) {
  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Escolha a data e horário para seu agendamento:
      </p>
      
      {/* Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="date">Data do agendamento</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDate}
          max={maxDateString}
          className="w-full"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="space-y-3">
          <Label>Horários disponíveis</Label>
          
          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  size="sm"
                  disabled={!slot.available}
                  onClick={() => onTimeChange(slot.time)}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {slot.time}
                </Button>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Carregando horários disponíveis...</p>
              </CardContent>
            </Card>
          )}
          
          {timeSlots.length > 0 && !timeSlots.some(slot => slot.available) && (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                <p>Não há horários disponíveis para esta data.</p>
                <p className="text-sm mt-1">Tente selecionar outra data.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}