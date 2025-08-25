import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Mail, CreditCard, MessageSquare, Upload } from "lucide-react";
import { useSaaSSettings } from "@/hooks/useSuperAdminData";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminConfiguracoes() {
  const { settings, loading, updateSettings } = useSaaSSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '',
    logo_url: '',
    sender_email: '',
    sender_name: '',
    resend_api_key: '',
    stripe_publishable_key: '',
    stripe_secret_key: '',
    stripe_webhook_secret: '',
    sms_provider: '',
    sms_number: '',
    twilio_sid: '',
    twilio_token: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        description: '',
        domain: '',
        logo_url: settings.logo_url || '',
        sender_email: settings.sender_email || '',
        sender_name: '',
        resend_api_key: settings.resend_api_key || '',
        stripe_publishable_key: settings.stripe_publishable_key || '',
        stripe_secret_key: settings.stripe_secret_key || '',
        stripe_webhook_secret: '',
        sms_provider: settings.sms_provider_config?.provider || '',
        sms_number: settings.sms_provider_config?.number || '',
        twilio_sid: settings.sms_provider_config?.account_sid || '',
        twilio_token: settings.sms_provider_config?.auth_token || ''
      });
    }
  }, [settings]);

  const handleSaveGeneral = async () => {
    try {
      await updateSettings({
        name: formData.name,
        logo_url: formData.logo_url
      });
      console.info("OK: General settings saved");
    } catch (error) {
      console.error("Error saving general settings:", error);
    }
  };

  const handleSaveEmail = async () => {
    try {
      await updateSettings({
        sender_email: formData.sender_email,
        resend_api_key: formData.resend_api_key
      });
      console.info("OK: Email settings saved");
    } catch (error) {
      console.error("Error saving email settings:", error);
    }
  };

  const handleSaveStripe = async () => {
    try {
      await updateSettings({
        stripe_publishable_key: formData.stripe_publishable_key,
        stripe_secret_key: formData.stripe_secret_key
      });
      console.info("OK: Stripe settings saved");
    } catch (error) {
      console.error("Error saving Stripe settings:", error);
    }
  };

  const handleSaveSMS = async () => {
    try {
      const smsProviderConfig = {
        provider: formData.sms_provider,
        number: formData.sms_number,
        account_sid: formData.twilio_sid,
        auth_token: formData.twilio_token
      };
      
      await updateSettings({
        sms_provider_config: smsProviderConfig
      });
      console.info("OK: SMS settings saved");
    } catch (error) {
      console.error("Error saving SMS settings:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações do SaaS</h1>
        <p className="text-muted-foreground mt-2">
          Configure as informações gerais e integrações do sistema
        </p>
      </div>

      {/* Informações gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações Gerais
          </CardTitle>
          <CardDescription>
            Configure o nome, logo e informações básicas do SaaS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="saas-name">Nome do SaaS</Label>
              <Input
                id="saas-name"
                placeholder="Nexio SaaS"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saas-domain">Domínio</Label>
              <Input
                id="saas-domain"
                placeholder="app.nexio.com"
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saas-description">Descrição</Label>
            <Textarea
              id="saas-description"
              placeholder="Sistema completo para gestão de salões de beleza e barbearias"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Logo do SaaS</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Alterar Logo
              </Button>
            </div>
          </div>

          <Button onClick={handleSaveGeneral}>Salvar Alterações</Button>
        </CardContent>
      </Card>

      {/* Configurações de email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configurações de Email
          </CardTitle>
          <CardDescription>
            Configure o provedor de email e remetente padrão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender-email">Email Remetente</Label>
              <Input
                id="sender-email"
                type="email"
                placeholder="noreply@nexio.com"
                value={formData.sender_email}
                onChange={(e) => setFormData(prev => ({ ...prev, sender_email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender-name">Nome Remetente</Label>
              <Input
                id="sender-name"
                placeholder="Nexio SaaS"
                value={formData.sender_name}
                onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resend-api">Chave API Resend</Label>
            <Input
              id="resend-api"
              type="password"
              placeholder="re_xxxxxxxxxxxxxxxxx"
              value={formData.resend_api_key}
              onChange={(e) => setFormData(prev => ({ ...prev, resend_api_key: e.target.value }))}
            />
          </div>

          <Button onClick={handleSaveEmail}>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Configurações do Stripe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Integração Stripe
          </CardTitle>
          <CardDescription>
            Configure as chaves da API do Stripe para processamento de pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-public">Chave Pública Stripe</Label>
              <Input
                id="stripe-public"
                placeholder="pk_test_..."
                value={formData.stripe_publishable_key}
                onChange={(e) => setFormData(prev => ({ ...prev, stripe_publishable_key: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-secret">Chave Secreta Stripe</Label>
              <Input
                id="stripe-secret"
                type="password"
                placeholder="sk_test_..."
                value={formData.stripe_secret_key}
                onChange={(e) => setFormData(prev => ({ ...prev, stripe_secret_key: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Webhook Secret</Label>
            <Input
              id="webhook-secret"
              type="password"
              placeholder="whsec_..."
              value={formData.stripe_webhook_secret}
              onChange={(e) => setFormData(prev => ({ ...prev, stripe_webhook_secret: e.target.value }))}
            />
          </div>

          <Button onClick={handleSaveStripe}>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Configurações de SMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Configurações de SMS/WhatsApp
          </CardTitle>
          <CardDescription>
            Configure o provedor de SMS e WhatsApp para notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sms-provider">Provedor SMS</Label>
              <Input
                id="sms-provider"
                placeholder="Twilio"
                value={formData.sms_provider}
                onChange={(e) => setFormData(prev => ({ ...prev, sms_provider: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-number">Número WhatsApp</Label>
              <Input
                id="sms-number"
                placeholder="+55 11 99999-9999"
                value={formData.sms_number}
                onChange={(e) => setFormData(prev => ({ ...prev, sms_number: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twilio-sid">Account SID</Label>
              <Input
                id="twilio-sid"
                type="password"
                placeholder="AC..."
                value={formData.twilio_sid}
                onChange={(e) => setFormData(prev => ({ ...prev, twilio_sid: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio-token">Auth Token</Label>
              <Input
                id="twilio-token"
                type="password"
                placeholder="..."
                value={formData.twilio_token}
                onChange={(e) => setFormData(prev => ({ ...prev, twilio_token: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleSaveSMS}>Salvar Configurações</Button>
        </CardContent>
      </Card>
    </div>
  );
}