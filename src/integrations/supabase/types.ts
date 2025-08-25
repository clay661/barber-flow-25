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
    PostgrestVersion: "13.0.4"
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
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
          status: string | null
          telefone: string | null
          total_visits: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          status?: string | null
          telefone?: string | null
          total_visits?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          status?: string | null
          telefone?: string | null
          total_visits?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          id: string
          name: string
          pro_email: string | null
          pro_password: string | null
          role: Database["public"]["Enums"]["employee_role"] | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          pro_email?: string | null
          pro_password?: string | null
          role?: Database["public"]["Enums"]["employee_role"] | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          pro_email?: string | null
          pro_password?: string | null
          role?: Database["public"]["Enums"]["employee_role"] | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      salon_settings: {
        Row: {
          banner_url: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          public_link: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          public_link?: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          public_link?: string
          updated_at?: string
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
          status: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          name: string
          price: number
          status?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          price?: number
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employee_role: "ADMIN" | "SUBADMIN" | "FUNCIONARIO" | "RECEPCIONISTA"
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
      employee_role: ["ADMIN", "SUBADMIN", "FUNCIONARIO", "RECEPCIONISTA"],
    },
  },
} as const
