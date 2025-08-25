import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Mail, CreditCard, MessageSquare, Upload } from "lucide-react";

export default function SuperAdminConfiguracoes() {
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
                defaultValue="Nexio SaaS"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saas-domain">Domínio</Label>
              <Input
                id="saas-domain"
                placeholder="app.nexio.com"
                defaultValue="app.nexio.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saas-description">Descrição</Label>
            <Textarea
              id="saas-description"
              placeholder="Sistema completo para gestão de salões de beleza e barbearias"
              defaultValue="Sistema completo para gestão de salões de beleza e barbearias"
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

          <Button>Salvar Alterações</Button>
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
                defaultValue="noreply@nexio.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender-name">Nome Remetente</Label>
              <Input
                id="sender-name"
                placeholder="Nexio SaaS"
                defaultValue="Nexio SaaS"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resend-api">Chave API Resend</Label>
            <Input
              id="resend-api"
              type="password"
              placeholder="re_xxxxxxxxxxxxxxxxx"
              defaultValue="••••••••••••••••••••"
            />
          </div>

          <Button>Salvar Configurações</Button>
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
                defaultValue="pk_test_••••••••••••••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-secret">Chave Secreta Stripe</Label>
              <Input
                id="stripe-secret"
                type="password"
                placeholder="sk_test_..."
                defaultValue="••••••••••••••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Webhook Secret</Label>
            <Input
              id="webhook-secret"
              type="password"
              placeholder="whsec_..."
              defaultValue="••••••••••••••••••••"
            />
          </div>

          <Button>Salvar Configurações</Button>
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
                defaultValue="Twilio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-number">Número WhatsApp</Label>
              <Input
                id="sms-number"
                placeholder="+55 11 99999-9999"
                defaultValue="+55 11 99999-9999"
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
                defaultValue="••••••••••••••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio-token">Auth Token</Label>
              <Input
                id="twilio-token"
                type="password"
                placeholder="..."
                defaultValue="••••••••••••••••••••"
              />
            </div>
          </div>

          <Button>Salvar Configurações</Button>
        </CardContent>
      </Card>
    </div>
  );
}