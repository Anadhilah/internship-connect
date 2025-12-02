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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_id: string
          applied_at: string
          cover_letter: string | null
          id: string
          internship_id: string
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          cover_letter?: string | null
          id?: string
          internship_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          cover_letter?: string | null
          id?: string
          internship_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          participant1_id: string
          participant2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant1_id: string
          participant2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant1_id?: string
          participant2_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      intern_profiles: {
        Row: {
          availability: string | null
          created_at: string
          education_level: string | null
          experience_level: string | null
          field_of_study: string | null
          full_name: string
          id: string
          interests: string[] | null
          portfolio_url: string | null
          resume_url: string | null
          skills: string[] | null
          university: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          education_level?: string | null
          experience_level?: string | null
          field_of_study?: string | null
          full_name: string
          id?: string
          interests?: string[] | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          education_level?: string | null
          experience_level?: string | null
          field_of_study?: string | null
          full_name?: string
          id?: string
          interests?: string[] | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          application_deadline: string
          created_at: string
          department: string
          description: string
          duration: string
          education_level: string
          id: string
          location: string
          organization_id: string
          positions_available: number
          requirements: string
          responsibilities: string
          skills: string[]
          start_date: string
          status: string
          stipend: string
          title: string
          updated_at: string
          work_type: string
        }
        Insert: {
          application_deadline: string
          created_at?: string
          department: string
          description: string
          duration: string
          education_level: string
          id?: string
          location: string
          organization_id: string
          positions_available?: number
          requirements: string
          responsibilities: string
          skills: string[]
          start_date: string
          status?: string
          stipend: string
          title: string
          updated_at?: string
          work_type: string
        }
        Update: {
          application_deadline?: string
          created_at?: string
          department?: string
          description?: string
          duration?: string
          education_level?: string
          id?: string
          location?: string
          organization_id?: string
          positions_available?: number
          requirements?: string
          responsibilities?: string
          skills?: string[]
          start_date?: string
          status?: string
          stipend?: string
          title?: string
          updated_at?: string
          work_type?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_profiles: {
        Row: {
          company_name: string
          company_size: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_name: string
          company_size?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_name?: string
          company_size?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      delete_user_account: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "organization" | "intern"
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
      app_role: ["admin", "organization", "intern"],
    },
  },
} as const
