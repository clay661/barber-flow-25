export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      affiliates: {
        Row: {
          commission_rate: number
          created_at: string
          email: string
          id: string
          name: string
          referral_code: string
          status: string
          total_clicks: number
          total_commission: number
          total_conversions: number
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          email: string
          id?: string
          name: string
          referral_code: string
          status?: string
          total_clicks?: number
          total_commission?: number
          total_conversions?: number
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          email?: string
          id?: string
          name?: string
          referral_code?: string
          status?: string
          total_clicks?: number
          total_commission?: number
          total_conversions?: number
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          client_id: string | null
          created_at: string
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          service_id: string | null
          status: string
          total_price: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string
          total_price?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          status: string
          telefone: string | null
          total_visits: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          status?: string
          telefone?: string | null
          total_visits?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          status?: string
          telefone?: string | null
          total_visits?: number
        }
        Relationships: []
      }
      discount_coupons: {
        Row: {
          code: string
          created_at: string
          end_date: string | null
          id: string
          start_date: string | null
          status: string
          type: string
          updated_at: string
          usage_limit: number | null
          used_count: number
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Update: {
          code?: string
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      employees: {
        Row: {
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          created_at: string
          custom_role_name: string | null
          id: string
          name: string
          pro_email: string | null
          pro_password: string | null
          role: Database["public"]["Enums"]["employee_role"]
          status: string
          telefone: string | null
        }
        Insert: {
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          custom_role_name?: string | null
          id?: string
          name: string
          pro_email?: string | null
          pro_password?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          status?: string
          telefone?: string | null
        }
        Update: {
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          custom_role_name?: string | null
          id?: string
          name?: string
          pro_email?: string | null
          pro_password?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          status?: string
          telefone?: string | null
        }
        Relationships: []
      }
      notification_history: {
        Row: {
          appointment_id: string
          client_phone: string
          created_at: string
          id: string
          message: string
          provider: string
          provider_response: Json | null
          sent_at: string
          status: string
        }
        Insert: {
          appointment_id: string
          client_phone: string
          created_at?: string
          id?: string
          message: string
          provider: string
          provider_response?: Json | null
          sent_at?: string
          status?: string
        }
        Update: {
          appointment_id?: string
          client_phone?: string
          created_at?: string
          id?: string
          message?: string
          provider?: string
          provider_response?: Json | null
          sent_at?: string
          status?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          api_key_sid: string
          auth_token: string
          created_at: string
          from_email: string | null
          id: string
          is_active: boolean
          notification_mode: string
          phone_number: string
          provider: string
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_user: string | null
          updated_at: string
        }
        Insert: {
          api_key_sid?: string
          auth_token?: string
          created_at?: string
          from_email?: string | null
          id?: string
          is_active?: boolean
          notification_mode?: string
          phone_number?: string
          provider?: string
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
        }
        Update: {
          api_key_sid?: string
          auth_token?: string
          created_at?: string
          from_email?: string | null
          id?: string
          is_active?: boolean
          notification_mode?: string
          phone_number?: string
          provider?: string
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_date: string
          status: string
          stripe_payment_intent_id: string | null
          subscription_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_date?: string
          status?: string
          stripe_payment_intent_id?: string | null
          subscription_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_date?: string
          status?: string
          stripe_payment_intent_id?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      saas_settings: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          resend_api_key: string | null
          sender_email: string | null
          sms_provider_config: Json | null
          stripe_publishable_key: string | null
          stripe_secret_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          resend_api_key?: string | null
          sender_email?: string | null
          sms_provider_config?: Json | null
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          resend_api_key?: string | null
          sender_email?: string | null
          sms_provider_config?: Json | null
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      salon_settings: {
        Row: {
          address: string | null
          banner_url: string | null
          created_at: string
          description: string | null
          document_number: string | null
          document_type: string | null
          email_notifications_enabled: boolean | null
          id: string
          logo_url: string | null
          name: string
          notifications_enabled: boolean | null
          phone: string | null
          public_link: string
          scheduling_interval: number | null
          updated_at: string
          working_hours: Json | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          created_at?: string
          description?: string | null
          document_number?: string | null
          document_type?: string | null
          email_notifications_enabled?: boolean | null
          id?: string
          logo_url?: string | null
          name?: string
          notifications_enabled?: boolean | null
          phone?: string | null
          public_link?: string
          scheduling_interval?: number | null
          updated_at?: string
          working_hours?: Json | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          created_at?: string
          description?: string | null
          document_number?: string | null
          document_type?: string | null
          email_notifications_enabled?: boolean | null
          id?: string
          logo_url?: string | null
          name?: string
          notifications_enabled?: boolean | null
          phone?: string | null
          public_link?: string
          scheduling_interval?: number | null
          updated_at?: string
          working_hours?: Json | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          created_at: string
          id: string
          last_password_change: string | null
          two_factor_enabled: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_password_change?: string | null
          two_factor_enabled?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_password_change?: string | null
          two_factor_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          duration_minutes: number
          id: string
          name: string
          price: number
          status: string
        }
        Insert: {
          category?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          name: string
          price?: number
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          name?: string
          price?: number
          status?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          name: string
          price_monthly: number
          price_yearly: number | null
          status: string
          stripe_price_id: string | null
          trial_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price_monthly?: number
          price_yearly?: number | null
          status?: string
          stripe_price_id?: string | null
          trial_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          status?: string
          stripe_price_id?: string | null
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string
          trial_end: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id: string
          trial_end?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string
          trial_end?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: string | null
          email: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          email: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          email?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_password: {
        Args: { hash: string; password: string }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "agendado" | "concluido" | "cancelado" | "no_show"
      commission_type: "percentage" | "fixed"
      employee_role:
        | "ADMIN"
        | "SUBADMIN"
        | "FUNCIONARIO"
        | "RECEPCIONISTA"
        | "OUTRO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["agendado", "concluido", "cancelado", "no_show"],
      commission_type: ["percentage", "fixed"],
      employee_role: [
        "ADMIN",
        "SUBADMIN",
        "FUNCIONARIO",
        "RECEPCIONISTA",
        "OUTRO",
      ],
    },
  },
} as const
