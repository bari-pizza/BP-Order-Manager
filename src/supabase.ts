export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      Drawer: {
        Row: {
          created_at: string
          drawer_id: string
          drawer_type: Database["public"]["Enums"]["drawer_type"]
          name: string
        }
        Insert: {
          created_at?: string
          drawer_id?: string
          drawer_type: Database["public"]["Enums"]["drawer_type"]
          name: string
        }
        Update: {
          created_at?: string
          drawer_id?: string
          drawer_type?: Database["public"]["Enums"]["drawer_type"]
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
      Order: {
        Row: {
          business_date: string
          created_at: string
          drawer_id: string | null
          is_prepaid: boolean
          order_id: string
          order_name: string | null
          order_number: number | null
          order_type: Database["public"]["Enums"]["order_type"]
          origin: Database["public"]["Enums"]["order_origin"]
          phone: string | null
          total_in_cents: number
        }
        Insert: {
          business_date: string
          created_at?: string
          drawer_id?: string | null
          is_prepaid?: boolean
          order_id?: string
          order_name?: string | null
          order_number?: number | null
          order_type?: Database["public"]["Enums"]["order_type"]
          origin?: Database["public"]["Enums"]["order_origin"]
          phone?: string | null
          total_in_cents?: number
        }
        Update: {
          business_date?: string
          created_at?: string
          drawer_id?: string | null
          is_prepaid?: boolean
          order_id?: string
          order_name?: string | null
          order_number?: number | null
          order_type?: Database["public"]["Enums"]["order_type"]
          origin?: Database["public"]["Enums"]["order_origin"]
          phone?: string | null
          total_in_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "Order_origin_fkey"
            columns: ["origin"]
            isOneToOne: false
            referencedRelation: "OrderOrigin"
            referencedColumns: ["name"]
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
          is_prepaid_toggleable: boolean
          is_third_party: boolean
          name: Database["public"]["Enums"]["order_origin"]
        }
        Insert: {
          can_deliver?: boolean
          can_tip?: boolean
          default_is_prepaid?: boolean
          has_order_number?: boolean
          icon?: string | null
          is_prepaid_toggleable?: boolean
          is_third_party?: boolean
          name: Database["public"]["Enums"]["order_origin"]
        }
        Update: {
          can_deliver?: boolean
          can_tip?: boolean
          default_is_prepaid?: boolean
          has_order_number?: boolean
          icon?: string | null
          is_prepaid_toggleable?: boolean
          is_third_party?: boolean
          name?: Database["public"]["Enums"]["order_origin"]
        }
        Relationships: []
      }
      Payment: {
        Row: {
          amount_in_cents: number
          created_at: string
          order_id: string
          payment_id: string
          payment_type: Database["public"]["Enums"]["payment_type"]
          special_note: string
          tip_in_cents: number
        }
        Insert: {
          amount_in_cents?: number
          created_at?: string
          order_id: string
          payment_id?: string
          payment_type: Database["public"]["Enums"]["payment_type"]
          special_note?: string
          tip_in_cents?: number
        }
        Update: {
          amount_in_cents?: number
          created_at?: string
          order_id?: string
          payment_id?: string
          payment_type?: Database["public"]["Enums"]["payment_type"]
          special_note?: string
          tip_in_cents?: number
        }
        Relationships: [
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
          is_manager?: boolean
          last_name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      handle_employee_update: {
        Args: {
          p_profile: unknown
          p_is_driver: boolean
        }
        Returns: undefined
      }
      remove_orders_from_drawer: {
        Args: {
          p_order_ids: Json
          p_drawer_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      drawer_type: "driver" | "register" | "third_party" | "unassigned"
      order_origin: "Bari Pizza" | "DoorDash" | "Pizzamico"
      order_type: "delivery" | "pickup"
      payment_type: "cash" | "card" | "third_party"
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
