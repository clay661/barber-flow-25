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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          client_id: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
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
          created_at: string | null
          email: string | null
          id: string
          name: string
          status: string
          telefone: string | null
          total_visits: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          status?: string
          telefone?: string | null
          total_visits?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          status?: string
          telefone?: string | null
          total_visits?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          commission_type: Database["public"]["Enums"]["commission_type"] | null
          commission_value: number | null
          created_at: string | null
          custom_role_name: string | null
          id: string
          name: string
          pro_email: string
          pro_password: string
          role: Database["public"]["Enums"]["employee_role"]
          status: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          commission_type?:
            | Database["public"]["Enums"]["commission_type"]
            | null
          commission_value?: number | null
          created_at?: string | null
          custom_role_name?: string | null
          id?: string
          name: string
          pro_email: string
          pro_password: string
          role?: Database["public"]["Enums"]["employee_role"]
          status?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_type?:
            | Database["public"]["Enums"]["commission_type"]
            | null
          commission_value?: number | null
          created_at?: string | null
          custom_role_name?: string | null
          id?: string
          name?: string
          pro_email?: string
          pro_password?: string
          role?: Database["public"]["Enums"]["employee_role"]
          status?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_history: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          recipient: string
          sent_at: string | null
          status: string | null
          subject: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          recipient: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          email_template: string | null
          id: string
          reminder_hours_before: number | null
          sms_enabled: boolean | null
          sms_template: string | null
          updated_at: string | null
          whatsapp_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          email_template?: string | null
          id?: string
          reminder_hours_before?: number | null
          sms_enabled?: boolean | null
          sms_template?: string | null
          updated_at?: string | null
          whatsapp_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          email_template?: string | null
          id?: string
          reminder_hours_before?: number | null
          sms_enabled?: boolean | null
          sms_template?: string | null
          updated_at?: string | null
          whatsapp_enabled?: boolean | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          payment_date: string | null
          status: string
          subscription_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          status?: string
          subscription_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          status?: string
          subscription_id?: string | null
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
      salon_settings: {
        Row: {
          address: string | null
          closing_time: string | null
          created_at: string | null
          id: string
          name: string
          opening_time: string | null
          phone: string | null
          scheduling_interval: number | null
          updated_at: string | null
          working_days: number[] | null
        }
        Insert: {
          address?: string | null
          closing_time?: string | null
          created_at?: string | null
          id?: string
          name?: string
          opening_time?: string | null
          phone?: string | null
          scheduling_interval?: number | null
          updated_at?: string | null
          working_days?: number[] | null
        }
        Update: {
          address?: string | null
          closing_time?: string | null
          created_at?: string | null
          id?: string
          name?: string
          opening_time?: string | null
          phone?: string | null
          scheduling_interval?: number | null
          updated_at?: string | null
          working_days?: number[] | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          name: string
          price: number
          status: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          name: string
          price?: number
          status?: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          price?: number
          status?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          plan: string
          start_date: string | null
          status: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan?: string
          start_date?: string | null
          status?: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan?: string
          start_date?: string | null
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string | null
          slug: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          slug?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          slug?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_employee_password: {
        Args: { p_email: string; p_password: string }
        Returns: string
      }
    }
    Enums: {
      booking_status: "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO"
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
      booking_status: ["PENDENTE", "CONFIRMADO", "CANCELADO", "CONCLUIDO"],
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
