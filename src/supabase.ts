export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      AppSetting: {
        Row: {
          id: number
          setting_name: string
          setting_type: string
          setting_value: string
        }
        Insert: {
          id?: never
          setting_name: string
          setting_type: string
          setting_value: string
        }
        Update: {
          id?: never
          setting_name?: string
          setting_type?: string
          setting_value?: string
        }
        Relationships: []
      }
      BusinessDayDrawer: {
        Row: {
          bank_in_cents: number
          business_date: string
          drawer_id: string
          hours: number
          hours_in_cents: number
          is_locked: boolean
          other_in_cents: number
          special_note: string
        }
        Insert: {
          bank_in_cents?: number
          business_date: string
          drawer_id: string
          hours?: number
          hours_in_cents?: number
          is_locked?: boolean
          other_in_cents?: number
          special_note?: string
        }
        Update: {
          bank_in_cents?: number
          business_date?: string
          drawer_id?: string
          hours?: number
          hours_in_cents?: number
          is_locked?: boolean
          other_in_cents?: number
          special_note?: string
        }
        Relationships: [
          {
            foreignKeyName: "BusinessDayDrawer_drawer_id_fkey"
            columns: ["drawer_id"]
            isOneToOne: false
            referencedRelation: "Drawer"
            referencedColumns: ["drawer_id"]
          },
        ]
      }
      BusinessDayDriver: {
        Row: {
          business_date: string
          drawer_id: string
        }
        Insert: {
          business_date: string
          drawer_id: string
        }
        Update: {
          business_date?: string
          drawer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "businessdaysdriver_drawer_id_fkey"
            columns: ["drawer_id"]
            isOneToOne: false
            referencedRelation: "Drawer"
            referencedColumns: ["drawer_id"]
          },
        ]
      }
      BusinessDaySummary: {
        Row: {
          business_date: string
          is_locked: boolean
        }
        Insert: {
          business_date: string
          is_locked?: boolean
        }
        Update: {
          business_date?: string
          is_locked?: boolean
        }
        Relationships: []
      }
      CashTransfer: {
        Row: {
          amount_in_cents: number
          business_date: string
          cash_transfer_id: string
          created_at: string
          destination: string | null
          source: string | null
          special_note: string
          title: string
          transfer_type: Database["public"]["Enums"]["transfer_type"]
        }
        Insert: {
          amount_in_cents?: number
          business_date: string
          cash_transfer_id?: string
          created_at?: string
          destination?: string | null
          source?: string | null
          special_note?: string
          title?: string
          transfer_type: Database["public"]["Enums"]["transfer_type"]
        }
        Update: {
          amount_in_cents?: number
          business_date?: string
          cash_transfer_id?: string
          created_at?: string
          destination?: string | null
          source?: string | null
          special_note?: string
          title?: string
          transfer_type?: Database["public"]["Enums"]["transfer_type"]
        }
        Relationships: [
          {
            foreignKeyName: "CashTransfer_destination_fkey"
            columns: ["destination"]
            isOneToOne: false
            referencedRelation: "Drawer"
            referencedColumns: ["drawer_id"]
          },
          {
            foreignKeyName: "CashTransfer_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "Drawer"
            referencedColumns: ["drawer_id"]
          },
        ]
      }
      Drawer: {
        Row: {
          created_at: string
          drawer_id: string
          drawer_type: Database["public"]["Enums"]["drawer_type"]
          is_deleted: boolean
          name: string
        }
        Insert: {
          created_at?: string
          drawer_id?: string
          drawer_type: Database["public"]["Enums"]["drawer_type"]
          is_deleted?: boolean
          name: string
        }
        Update: {
          created_at?: string
          drawer_id?: string
          drawer_type?: Database["public"]["Enums"]["drawer_type"]
          is_deleted?: boolean
          name?: string
        }
        Relationships: []
      }
      Driver: {
        Row: {
          created_at: string
          drawer_id: string
          driver_id: string | null
          is_deleted: boolean
        }
        Insert: {
          created_at?: string
          drawer_id?: string
          driver_id?: string | null
          is_deleted?: boolean
        }
        Update: {
          created_at?: string
          drawer_id?: string
          driver_id?: string | null
          is_deleted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "drawers.drivers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drawers.drivers_id_fkey"
            columns: ["drawer_id"]
            isOneToOne: true
            referencedRelation: "Drawer"
            referencedColumns: ["drawer_id"]
          },
        ]
      }
      error_logs: {
        Row: {
          context: string | null
          created_at: string | null
          error_message: string
          id: number
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          error_message: string
          id?: never
        }
        Update: {
          context?: string | null
          created_at?: string | null
          error_message?: string
          id?: never
        }
        Relationships: []
      }
      GlobalChangeTracker: {
        Row: {
          table_name: string
          updated_at: string
        }
        Insert: {
          table_name: string
          updated_at?: string
        }
        Update: {
          table_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      Order: {
        Row: {
          business_date: string
          created_at: string
          delivery_fee_in_cents: number
          drawer_id: string | null
          is_locked: boolean
          last_updated_by: string | null
          order_id: string
          order_name: string | null
          order_number: number | null
          order_type: Database["public"]["Enums"]["order_type"]
          origin_id: string
          phone: string | null
          total_in_cents: number
        }
        Insert: {
          business_date: string
          created_at?: string
          delivery_fee_in_cents?: number
          drawer_id?: string | null
          is_locked?: boolean
          last_updated_by?: string | null
          order_id?: string
          order_name?: string | null
          order_number?: number | null
          order_type?: Database["public"]["Enums"]["order_type"]
          origin_id?: string
          phone?: string | null
          total_in_cents?: number
        }
        Update: {
          business_date?: string
          created_at?: string
          delivery_fee_in_cents?: number
          drawer_id?: string | null
          is_locked?: boolean
          last_updated_by?: string | null
          order_id?: string
          order_name?: string | null
          order_number?: number | null
          order_type?: Database["public"]["Enums"]["order_type"]
          origin_id?: string
          phone?: string | null
          total_in_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "Order_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Order_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "OrderOrigin"
            referencedColumns: ["origin_id"]
          },
          {
            foreignKeyName: "orders_drawer_id_fkey"
            columns: ["drawer_id"]
            isOneToOne: false
            referencedRelation: "Drawer"
            referencedColumns: ["drawer_id"]
          },
        ]
      }
      OrderOrigin: {
        Row: {
          can_deliver: boolean
          can_tip: boolean
          default_is_prepaid: boolean
          has_order_number: boolean
          icon: string | null
          is_deleted: boolean
          is_prepaid_toggleable: boolean
          is_third_party: boolean
          name: string
          origin_id: string
        }
        Insert: {
          can_deliver?: boolean
          can_tip?: boolean
          default_is_prepaid?: boolean
          has_order_number?: boolean
          icon?: string | null
          is_deleted?: boolean
          is_prepaid_toggleable?: boolean
          is_third_party?: boolean
          name: string
          origin_id?: string
        }
        Update: {
          can_deliver?: boolean
          can_tip?: boolean
          default_is_prepaid?: boolean
          has_order_number?: boolean
          icon?: string | null
          is_deleted?: boolean
          is_prepaid_toggleable?: boolean
          is_third_party?: boolean
          name?: string
          origin_id?: string
        }
        Relationships: []
      }
      Payment: {
        Row: {
          amount_in_cents: number
          business_date: string
          created_at: string
          is_locked: boolean
          last_updated_by: string | null
          order_id: string
          payment_id: string
          payment_type: Database["public"]["Enums"]["payment_type"]
          special_note: string
          tip_in_cents: number
        }
        Insert: {
          amount_in_cents?: number
          business_date: string
          created_at?: string
          is_locked?: boolean
          last_updated_by?: string | null
          order_id: string
          payment_id?: string
          payment_type: Database["public"]["Enums"]["payment_type"]
          special_note?: string
          tip_in_cents?: number
        }
        Update: {
          amount_in_cents?: number
          business_date?: string
          created_at?: string
          is_locked?: boolean
          last_updated_by?: string | null
          order_id?: string
          payment_id?: string
          payment_type?: Database["public"]["Enums"]["payment_type"]
          special_note?: string
          tip_in_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "Payment_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["order_id"]
          },
        ]
      }
      Profile: {
        Row: {
          avatar_src: string | null
          email: string
          first_name: string | null
          id: string
          is_admin: boolean
          is_cashier: boolean
          is_deleted: boolean
          is_manager: boolean
          last_name: string | null
          phone: string | null
        }
        Insert: {
          avatar_src?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_admin?: boolean
          is_cashier?: boolean
          is_deleted?: boolean
          is_manager?: boolean
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          avatar_src?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean
          is_cashier?: boolean
          is_deleted?: boolean
          is_manager?: boolean
          last_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_orders_to_drawer: {
        Args: {
          p_order_ids: Json
          p_drawer_id: string
        }
        Returns: Json
      }
      create_new_order_from_json: {
        Args: {
          p_order_json: Json
        }
        Returns: Json
      }
      handle_employee_update: {
        Args: {
          p_profile: unknown
          p_is_driver: boolean
        }
        Returns: Json
      }
      lock_drawer: {
        Args: {
          p_drawer_id: string
          p_business_date: string
        }
        Returns: Json
      }
      remove_orders_from_drawer: {
        Args: {
          p_order_ids: Json
          p_drawer_id: string
        }
        Returns: Json
      }
      unlock_drawer: {
        Args: {
          p_drawer_id: string
          p_business_date: string
        }
        Returns: Json
      }
      update_employee: {
        Args: {
          p_id: string
          p_is_deleted?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      drawer_type: "driver" | "register" | "third_party" | "unassigned"
      order_type: "delivery" | "pickup"
      payment_type: "cash" | "card" | "third_party"
      transfer_type: "bank" | "payment" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
