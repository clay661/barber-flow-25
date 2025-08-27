import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Users, Calendar, Scissors, UserCheck } from 'lucide-react';

export function DataExporter() {
  const [exportType, setExportType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportOptions = [
    { value: 'clients', label: 'Clientes', icon: Users },
    { value: 'appointments', label: 'Agendamentos', icon: Calendar },
    { value: 'services', label: 'Serviços', icon: Scissors },
    { value: 'employees', label: 'Funcionários', icon: UserCheck },
  ];

  const handleExport = async () => {
    if (!exportType) {
      toast({
        variant: "destructive",
        title: "Tipo não selecionado",
        description: "Selecione o tipo de dados para exportar",
      });
      return;
    }

    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-data', {
        body: {
          type: exportType,
          format: 'csv',
          dateFrom: dateFrom || null,
          dateTo: dateTo || null
        }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Erro ao exportar dados');
      }

      // Convert base64 to blob and download
      const byteCharacters = atob(data.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.mimeType });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: `Arquivo ${data.filename} baixado com sucesso`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: error.message,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedOption = exportOptions.find(opt => opt.value === exportType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Exportar Dados
        </CardTitle>
        <CardDescription>
          Exporte seus dados em formato CSV para análise externa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de dados:</Label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de dados" />
              </SelectTrigger>
              <SelectContent>
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {exportType === 'appointments' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">Data inicial (opcional):</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">Data final (opcional):</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button onClick={handleExport} disabled={isExporting || !exportType} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </Button>
        </div>

        {selectedOption && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <selectedOption.icon className="h-4 w-4" />
              <span className="font-medium">{selectedOption.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {exportType === 'clients' && "Exportará nome, email, telefone, total de visitas e data de cadastro dos clientes."}
              {exportType === 'appointments' && "Exportará data, cliente, funcionário, serviço, preço, status e observações dos agendamentos."}
              {exportType === 'services' && "Exportará nome, categoria, preço, duração, status e data de criação dos serviços."}
              {exportType === 'employees' && "Exportará nome, email, telefone, cargo, status, tipo de comissão e data de cadastro dos funcionários."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}